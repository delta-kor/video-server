import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import MusicResponse, { MusicItem } from './music.response';
import MusicService from './music.service';

class MusicController extends Controller {
  public readonly path: string = '/music';
  private readonly musicService: MusicService = ServiceProvider.get(MusicService);

  protected mount(): void {
    this.mounter.get('/', this.viewAll.bind(this));
  }

  private async viewAll(req: TypedRequest, res: TypedResponse<MusicResponse.ViewAll>): Promise<void> {
    const musics = this.musicService.viewAll();
    const result: MusicItem[] = [];

    for (const music of musics) {
      result.push({ id: music.hash, title: music.title, count: music.videos.length });
    }

    res.json({ ok: true, musics: result });
  }
}

export default MusicController;
