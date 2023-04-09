import Service from '../../services/base.service';
import CampdUser from './interface/campd-user.interface';
import CampdUserModel from './model/campd-user.model';
import UnauthorizedException from '../../exceptions/unauthorized.exception';

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

  public async getGames(): Promise<void> {}
}

export default CampdService;
