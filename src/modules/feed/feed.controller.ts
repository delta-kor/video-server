import Controller from '../../classes/controller.class';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import UploadPlaylistDto from './dto/upload-playlist.dto';
import FeedResponse from './feed.response';
import FeedService from './feed.service';

class FeedController extends Controller {
  public readonly path: string = '/feed';
  private readonly feedService: FeedService = ServiceProvider.get(FeedService);

  protected mount(): void {
    this.mounter.get('/playlist', this.getAllPlaylists.bind(this));
    this.mounter.post('/playlist', ValidateGuard(UploadPlaylistDto), this.uploadPlaylist.bind(this));
    this.mounter.get('/playlist/:id', this.getOnePlaylist.bind(this));
    this.mounter.delete('/playlist/:id', this.deletePlaylist.bind(this));
  }

  private async uploadPlaylist(
    req: TypedRequest<UploadPlaylistDto>,
    res: TypedResponse<FeedResponse.UploadPlaylist>
  ): Promise<void> {
    const playlist = await this.feedService.uploadPlaylist(req.body);
    const id = playlist.id;
    res.json({ ok: true, id });
  }

  private async getAllPlaylists(_req: TypedRequest, res: TypedResponse<FeedResponse.GetAllPlaylists>): Promise<void> {
    const playlists = this.feedService.getAllPlaylists();
    res.json({
      ok: true,
      playlists: playlists.map(playlist => ({ id: playlist.id, title: playlist.title, videos: playlist.video })),
    });
  }

  private async getOnePlaylist(req: TypedRequest, res: TypedResponse<FeedResponse.GetOnePlaylist>): Promise<void> {
    const id = req.params.id;
    const playlists = this.feedService.getOnePlaylist(id);
    res.json({ ok: true, id: playlists.id, title: playlists.title, videos: playlists.video });
  }

  private async deletePlaylist(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id = req.params.id;
    await this.feedService.deletePlaylist(id);
    res.json({ ok: true });
  }
}

export default FeedController;
