import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import MusicService from './music.service';

class MusicController extends Controller {
  public readonly path: string = '/music';
  private readonly musicService: MusicService = ServiceProvider.get(MusicService);

  protected mount(): void {
    this.mounter.get('/album', this.getAllAlbums.bind(this));
  }

  private async getAllAlbums(req: TypedRequest, res: TypedResponse<any>): Promise<any> {
    const albums = this.musicService.getAllAlbums();
    res.json({ ok: true, albums });
  }
}

export default MusicController;
