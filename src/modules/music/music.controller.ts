import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import { Music } from './music.interface';
import MusicResponse from './music.response';
import MusicService from './music.service';
import I18nUtil from '../../utils/i18n.util';
import { SentryLog } from '../../decorators/sentry.decorator';

class MusicController extends Controller {
  public readonly path: string = '/music';
  private readonly musicService: MusicService = ServiceProvider.get(MusicService);

  protected mount(): void {
    this.mounter.get('/album', this.getAllAlbums.bind(this));
    this.mounter.get('/album/:id', this.getOneAlbum.bind(this));
    this.mounter.get('/:id', this.getOneMusic.bind(this));
  }

  @SentryLog('music controller', 'get all albums')
  private async getAllAlbums(_req: TypedRequest, res: TypedResponse<MusicResponse.GetAllAlbums>): Promise<void> {
    const albums = this.musicService.getAllAlbums();
    res.json({ ok: true, albums });
  }

  @SentryLog('music controller', 'get one album')
  private async getOneAlbum(req: TypedRequest, res: TypedResponse<MusicResponse.GetOneAlbum>): Promise<void> {
    const id: string = req.params.id;
    const { album, musics } = this.musicService.getOneAlbum(id);

    const serializedMusics: Music[] = [];
    for (const music of musics) {
      serializedMusics.push({
        id: music.id,
        title: I18nUtil.getVideoTitle(music.title, req.i18n.resolvedLanguage),
        videos: music.videos.map(video => video.serialize(req, 'id', 'description', 'date', 'duration', 'properties')),
        albumId: music.albumId,
      });
    }

    res.json({ ok: true, album, musics: serializedMusics });
  }

  @SentryLog('music controller', 'get one music')
  private async getOneMusic(req: TypedRequest, res: TypedResponse<MusicResponse.GetOneMusic>): Promise<void> {
    const id: string = req.params.id;
    const music = this.musicService.getOneMusic(id);
    const serializedMusic: Music = {
      id: music.id,
      title: I18nUtil.getVideoTitle(music.title, req.i18n.resolvedLanguage),
      videos: music.videos.map(video => video.serialize(req, 'id', 'description', 'date', 'duration', 'properties')),
      albumId: music.albumId,
    };
    res.json({ ok: true, music: serializedMusic });
  }
}

export default MusicController;
