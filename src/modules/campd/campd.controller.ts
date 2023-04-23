import Controller from '../../classes/controller.class';
import CampdService from './campd.service';
import ServiceProvider from '../../services/provider.service';
import AuthGuard from '../../guards/auth.guard';
import CampdGuard from '../../guards/campd.guard';
import CampdResponse from './campd.response';
import NotFoundException from '../../exceptions/not-found.exception';
import CampdSubmitDto from './dto/submit.dto';
import ValidateGuard from '../../guards/validate.guard';

class CampdController extends Controller {
  public readonly path: string = '/campd';
  private readonly campdService: CampdService = ServiceProvider.get(CampdService);

  protected mount(): void {
    this.mounter.get('/games', AuthGuard(false), CampdGuard(), this.getGames.bind(this));
    this.mounter.get('/games/:id/video', this.redirectVideo.bind(this));
    this.mounter.post(
      '/games/:id/submit',
      AuthGuard(false),
      CampdGuard(),
      ValidateGuard(CampdSubmitDto),
      this.submit.bind(this)
    );
    this.mounter.get('/games/:id/token', AuthGuard(false), CampdGuard(), this.createGameToken.bind(this));
    this.mounter.get('/games/:id/rank', AuthGuard(false), CampdGuard(), this.getGameRank.bind(this));
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

  private async submit(req: TypedRequest<CampdSubmitDto>, res: TypedResponse<CampdResponse.Submit>): Promise<void> {
    const id = req.params.id;
    if (!id) throw new NotFoundException();

    const token = req.body.token;
    this.campdService.validateGameToken(token, id);

    const campdUser = await this.campdService.getCampdUserByRequest(req);
    const input = req.body.input;

    const result = await this.campdService.submit(campdUser, id, input, token);

    res.json({ ok: true, result });
  }

  private async createGameToken(req: TypedRequest, res: TypedResponse<CampdResponse.CreateToken>): Promise<void> {
    const id = req.params.id;
    if (!id) throw new NotFoundException();

    const token = this.campdService.createGameToken(id);

    res.json({ ok: true, token });
  }

  private async getGameRank(req: TypedRequest, res: TypedResponse<CampdResponse.GameRank>): Promise<void> {
    const id = req.params.id;
    if (!id) throw new NotFoundException();

    const campdUser = await this.campdService.getCampdUserByRequest(req);
    const [rank, me] = await this.campdService.getGameRank(id, campdUser);

    res.json({ ok: true, rank, me });
  }
}

export default CampdController;
