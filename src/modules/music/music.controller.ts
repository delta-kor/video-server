import Controller from '../../classes/controller.class';
import NotFoundException from '../../exceptions/not-found.exception';
import ServiceProvider from '../../services/provider.service';
import MusicResponse, { MusicItem, VideoItem } from './music.response';
import MusicService from './music.service';

class MusicController extends Controller {
  public readonly path: string = '/music';
  private readonly musicService: MusicService = ServiceProvider.get(MusicService);

  protected mount(): void {
    this.mounter.get('/', this.viewAll.bind(this));
    this.mounter.get('/:id', this.viewOne.bind(this));
  }

  private async viewAll(_req: TypedRequest, res: TypedResponse<MusicResponse.ViewAll>): Promise<void> {
    const musics = this.musicService.viewAll();
    const result: MusicItem[] = [];

    for (const music of musics) {
      result.push({ id: music.hash, title: music.title, count: music.videos.length });
    }

    const sortedResult = result.sort((a, b) => b.count - a.count);

    res.json({ ok: true, musics: sortedResult });
  }

  private async viewOne(req: TypedRequest, res: TypedResponse<MusicResponse.ViewOne>): Promise<void> {
    const id = req.params.id;

    const music = this.musicService.viewOne(id);
    if (!music) throw new NotFoundException();

    const result = music.videos.map<VideoItem>(video => ({
      id: video.id,
      description: video.description,
      date: video.date.getTime(),
      duration: video.duration,
    }));

    res.json({ ok: true, videos: result });
  }
}

export default MusicController;
