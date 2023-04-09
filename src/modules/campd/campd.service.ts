import Service from '../../services/base.service';
import CampdUser from './interface/campd-user.interface';
import CampdUserModel from './model/campd-user.model';
import UnauthorizedException from '../../exceptions/unauthorized.exception';
import CampdVideoModel from './model/campd-video.model';
import CampdGame from './interface/campd-game.interface';
import CampdVideo from './interface/campd-video.interface';

class CampdService extends Service {
  public async getCampdUserById(id: string): Promise<CampdUser | null> {
    const user = await CampdUserModel.findOne({ id });
    return user || null;
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
}

export default CampdService;
