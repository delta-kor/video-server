import Controller from '../../classes/controller.class';
import CampdService from './campd.service';
import ServiceProvider from '../../services/provider.service';
import AuthGuard from '../../guards/auth.guard';
import CampdGuard from '../../guards/campd.guard';
import CampdResponse from './campd.response';
import NotFoundException from '../../exceptions/not-found.exception';

class CampdController extends Controller {
  public readonly path: string = '/campd';
  private readonly campdService: CampdService = ServiceProvider.get(CampdService);

  protected mount(): void {
    this.mounter.get('/games', AuthGuard(false), CampdGuard(), this.getGames.bind(this));
    this.mounter.get('/games/:id/video', this.redirectVideo.bind(this));
  }

  private async getGames(req: TypedRequest, res: TypedResponse<CampdResponse.GetGames>): Promise<void> {
    const campdUser = await this.campdService.getCampdUserByRequest(req);
    const games = await this.campdService.getGames(campdUser);
    res.json({ ok: true, games });
  }

  private async redirectVideo(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id = req.params.id;
    if (!id) throw new NotFoundException();

    const videoUrl = await this.campdService.getVideoUrl(id);
    res.redirect(videoUrl);
  }
}

export default CampdController;
