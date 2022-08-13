import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import { Music } from './music.interface';
import MusicResponse from './music.response';
import MusicService from './music.service';

class MusicController extends Controller {
  public readonly path: string = '/music';
  private readonly musicService: MusicService = ServiceProvider.get(MusicService);

  protected mount(): void {
    this.mounter.get('/album', this.getAllAlbums.bind(this));
    this.mounter.get('/album/:id', this.getOneAlbum.bind(this));
  }

  private async getAllAlbums(_req: TypedRequest, res: TypedResponse<MusicResponse.GetAllAlbums>): Promise<void> {
    const albums = this.musicService.getAllAlbums();
    res.json({ ok: true, albums });
  }

  private async getOneAlbum(req: TypedRequest, res: TypedResponse<MusicResponse.GetOneAlbum>): Promise<void> {
    const id: string = req.params.id;
    const { album, musics } = this.musicService.getOneAlbum(id);

    const serializedMusics: Music[] = [];
    for (const music of musics) {
      serializedMusics.push({
        title: music.title,
        id: music.id,
        videos: music.videos.map(video => video.serialize('id', 'description', 'date', 'duration', 'is_4k')),
      });
    }

    res.json({ ok: true, album, musics: serializedMusics });
  }
}

export default MusicController;
