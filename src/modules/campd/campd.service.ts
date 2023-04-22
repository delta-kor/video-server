import Service from '../../services/base.service';
import CampdUser from './interface/campd-user.interface';
import CampdUserModel from './model/campd-user.model';
import UnauthorizedException from '../../exceptions/unauthorized.exception';
import CampdVideoModel from './model/campd-video.model';
import CampdGame, { CampdGameInput, CampdGameResult } from './interface/campd-game.interface';
import CampdVideo from './interface/campd-video.interface';
import DeliverService from '../deliver/deliver.service';
import ServiceProvider from '../../services/provider.service';
import NotFoundException from '../../exceptions/not-found.exception';
import getCurrentTimeItem from '../../utils/timemap.util';
import crypto from 'crypto';
import CampdRecordModel from './model/campd-record.model';

const CampdLongThreshold = 7000;
const CampdShortThreshold = 1000;

class CampdService extends Service {
  private readonly deliverService: DeliverService = ServiceProvider.get(DeliverService);

  public async getCampdUserById(id: string): Promise<CampdUser | null> {
    const user = await CampdUserModel.findOne({ id });
    return user || null;
  }

  public async getCampdVideoById(id: string): Promise<CampdVideo | null> {
    const video = await CampdVideoModel.findOne({ id });
    return video || null;
  }

  public async getCampdUserByRequest(req: TypedRequest): Promise<CampdUser> {
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const campdUser = await this.getCampdUserById(user.id);
    if (!campdUser) throw new UnauthorizedException();

    return campdUser;
  }

  public async getGames(campdUser: CampdUser): Promise<CampdGame[]> {
    const result: CampdGame[] = [];

    const videos: CampdVideo[] = await CampdVideoModel.find();
    for (const video of videos) {
      result.push({
        id: video.id,
        title: video.title,
        description: video.description,
        score: campdUser.scoreboard[video.id] || 0,
      });
    }

    return result;
  }

  public async getVideoUrl(id: string): Promise<string> {
    const campdVideo = await this.getCampdVideoById(id);
    if (!campdVideo) throw new NotFoundException();

    const cdnInfo = await this.deliverService.getCdnInfo(campdVideo.cdn_id, 1080);
    return cdnInfo.url;
  }

  public async submit(
    campdUser: CampdUser,
    id: string,
    input: CampdGameInput,
    token: string
  ): Promise<CampdGameResult> {
    const campdVideo = await this.getCampdVideoById(id);
    if (!campdVideo) throw new NotFoundException();

    const video = await this.getCampdVideoById(id);
    if (!video) throw new NotFoundException();

    const scoresheet = video.scoresheet;
    const timesheet = scoresheet.timesheet;

    const groupCameraIndex = scoresheet.group_index;

    const result: CampdGameResult = {
      total_score: 0,
      group_bonus: 0,
      solo_bonus: 0,
      long_penalty: 0,
      short_penalty: 0,
      miss_penalty: 0,
      exp: 0,
    };

    let lastCamera: number | null = null;
    let currentCameraDuration: number = 0;

    let shortDuration: number = 0;

    const duration = video.duration;
    const step = 10;
    for (let i = 0; i < duration; i += step) {
      const currentCamera = getCurrentTimeItem(timesheet, i);
      const currentInput = getCurrentTimeItem(input, i);
      if (typeof currentInput !== 'number') continue;

      const currentCameraType = currentCamera.type;
      const cameras = currentCamera.cameras;

      let penalty: null | 'long' | 'short' = null;

      if (lastCamera === currentInput) {
        currentCameraDuration += step;
        if (currentCameraDuration > CampdLongThreshold) penalty = 'long';
      } else {
        if (currentCameraDuration < CampdShortThreshold && lastCamera !== null) {
          penalty = 'short';
          shortDuration += currentCameraDuration;
        }
        lastCamera = currentInput;
        currentCameraDuration = 0;
      }

      const scoreBefore = result.total_score;

      if (currentInput === groupCameraIndex) {
        if (currentCameraType === 'group') {
          result.total_score += scoresheet.score_group_focused;
          result.group_bonus += scoresheet.score_group_focused - scoresheet.score_solo_perfect_default;
        } else {
          result.total_score += scoresheet.score_group_default;
        }
      } else {
        const isFocused = currentCameraType === 'solo';

        switch (cameras[currentInput]) {
          case 'perfect':
            if (isFocused) {
              result.total_score += scoresheet.score_solo_perfect_focused;
              result.solo_bonus += scoresheet.score_solo_perfect_focused - scoresheet.score_group_default;
            } else {
              result.total_score += scoresheet.score_solo_perfect_default;
            }
            break;
          case 'in':
            if (isFocused) result.total_score += scoresheet.score_solo_in_focused;
            else result.total_score += scoresheet.score_solo_in_default;
            break;
          case 'out':
            if (isFocused) {
              result.total_score += scoresheet.score_solo_out_focused;
              result.miss_penalty += scoresheet.score_solo_perfect_focused - scoresheet.score_solo_out_focused;
            } else {
              result.total_score += scoresheet.score_solo_out_default;
              result.miss_penalty += scoresheet.score_solo_perfect_default - scoresheet.score_solo_out_default;
            }
            break;
        }
      }

      const scoreAfter = result.total_score;
      const scoreDelta = Math.abs(scoreAfter - scoreBefore);
      if (penalty === 'long') {
        const penaltyScore = Math.round((1 - scoresheet.long_ratio) * scoreDelta);
        result.total_score -= penaltyScore;
        result.long_penalty += penaltyScore;
      }
    }

    const shortPenaltyScore = Math.round(
      result.total_score * (shortDuration / duration) * (1 - scoresheet.short_ratio)
    );
    result.short_penalty = shortPenaltyScore;
    result.total_score -= shortPenaltyScore;

    const durationScore = (duration / step) * scoresheet.exp;
    const exp = Math.round((result.total_score / durationScore) * scoresheet.exp_size);
    const sanitizedExp = Math.max(exp, 0);

    result.exp = sanitizedExp;
    campdUser.exp += sanitizedExp;
    await campdUser.save();

    const record = new CampdRecordModel({ token, user_id: campdUser.id, input, result });
    await record.save();

    return result;
  }

  public createGameToken(id: string): string {
    const random = crypto.randomBytes(4).toString('hex');
    const hash = crypto
      .createHash('md5')
      .update(random)
      .update(id)
      .update(process.env.SECRET_KEY as string)
      .digest('hex');
    return `${random}.${hash.slice(0, 8)}`;
  }

  public validateGameToken(token: string, id: string): true {
    const random = token.split('.')[0];
    const hash = token.split('.')[1];

    const newHash = crypto
      .createHash('md5')
      .update(random)
      .update(id)
      .update(process.env.SECRET_KEY as string)
      .digest('hex');

    if (hash === newHash.slice(0, 8)) return true;
    else throw new UnauthorizedException();
  }
}

export default CampdService;
