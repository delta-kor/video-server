import Controller from '../../classes/controller.class';
import CampdService from './campd.service';
import ServiceProvider from '../../services/provider.service';
import AuthGuard from '../../guards/auth.guard';
import CampdGuard from '../../guards/campd.guard';

class CampdController extends Controller {
  public readonly path: string = '/campd';
  private readonly campdService: CampdService = ServiceProvider.get(CampdService);

  protected mount(): void {
    this.mounter.get('/games', AuthGuard(false), CampdGuard(), this.getGames.bind(this));
  }

  private async getGames(req: TypedRequest, res: TypedResponse): Promise<void> {}
}

export default CampdController;
