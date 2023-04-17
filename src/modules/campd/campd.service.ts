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

  public async submit(campdUser: CampdUser, id: string, input: CampdGameInput): Promise<CampdGameResult> {
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
    };

    const duration = video.duration;
    for (let i = 0; i < duration; i += 10) {
      const currentCamera = getCurrentTimeItem(timesheet, i);
      const currentInput = getCurrentTimeItem(input, i);
      if (typeof currentInput !== 'number') continue;

      const currentCameraType = currentCamera.type;
      const cameras = currentCamera.cameras;

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
    }

    return result;
  }
}

export default CampdService;
