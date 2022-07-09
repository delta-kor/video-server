import Controller from '../../../classes/controller.class';
import Constants from '../../../constants';
import UnprocessableEntityException from '../../../exceptions/unprocessable-entity.exception';
import ManageGuard from '../../../guards/manage.guard';
import ValidateGuard from '../../../guards/validate.guard';
import ServiceProvider from '../../../services/provider.service';
import CreatePlaylistDto from '../dto/create-playlist';
import FeedResponse from '../feed.response';
import PlaylistService from '../service/playlist.service';

class PlaylistController extends Controller {
  public readonly path: string = '/feed/playlist';
  private readonly playlistService: PlaylistService = ServiceProvider.get(PlaylistService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(CreatePlaylistDto), this.create.bind(this));
    this.mounter.delete('/:id', ManageGuard, this.delete.bind(this));
  }

  private async create(
    req: TypedRequest<CreatePlaylistDto>,
    res: TypedResponse<FeedResponse.CreatePlaylist>
  ): Promise<void> {
    if (!Constants.VIDEO_TYPES.includes(req.body.type)) throw new UnprocessableEntityException('잘못된 타입이에요');

    const playlist = await this.playlistService.create(req.body);
    res.json({ ok: true, id: playlist.id });
  }

  private async delete(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id = req.params.id;
    await this.playlistService.delete(id);
    res.json({ ok: true });
  }
}

export default PlaylistController;
