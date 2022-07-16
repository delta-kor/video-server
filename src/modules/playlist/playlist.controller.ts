import Controller from '../../classes/controller.class';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import PlaylistDto from './dto/playlist.dto';
import PlaylistResponse from './playlist.response';
import PlaylistService from './playlist.service';

class PlaylistController extends Controller {
  public readonly path: string = '/playlist';
  private readonly playlistService: PlaylistService = ServiceProvider.get(PlaylistService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(PlaylistDto), this.create.bind(this));
    this.mounter.get('/:id', this.read.bind(this));
    this.mounter.put('/:id', ManageGuard, ValidateGuard(PlaylistDto, 'body', true), this.update.bind(this));
    this.mounter.delete('/:id', ManageGuard, this.delete.bind(this));
  }

  private async create(
    req: TypedRequest<PlaylistDto>,
    res: TypedResponse<PlaylistResponse.CreatePlaylist>
  ): Promise<void> {
    const playlist = await this.playlistService.create(req.body);
    res.json({ ok: true, id: playlist.id });
  }

  private async read(req: TypedRequest, res: TypedResponse<PlaylistResponse.ReadPlaylist>): Promise<void> {
    const id: string = req.params.id;
    const playlist = await this.playlistService.read(id);
    const serializedPlaylist = playlist.serialize('id', 'title', 'description', 'video');

    res.json({ ok: true, playlist: serializedPlaylist });
  }

  private async update(
    req: TypedRequest<Partial<PlaylistDto>>,
    res: TypedResponse<PlaylistResponse.UpdatePlaylist>
  ): Promise<void> {
    const id: string = req.params.id;
    const playlist = await this.playlistService.update(id, req.body);
    const serializedPlaylist = playlist.serialize(
      'id',
      'label',
      'type',
      'title',
      'description',
      'video',
      'featured',
      'order'
    );

    res.json({ ok: true, playlist: serializedPlaylist });
  }

  private async delete(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id: string = req.params.id;
    await this.playlistService.delete(id);
    res.json({ ok: true });
  }
}

export default PlaylistController;
