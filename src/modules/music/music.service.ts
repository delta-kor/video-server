import crypto from 'crypto';
import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';
import { Album, Music } from './music.interface';
import { AlbumStore, MusicStore } from './music.store';
import { SentryLog } from '../../decorators/sentry.decorator';

class MusicService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly album: Map<string, Map<string, Music>> = new Map();

  @SentryLog('music service', 'hash title')
  private static hashTitle(title: string): string {
    const hasher = crypto.createHash('md5');
    hasher.update(title);
    return hasher.digest('hex').slice(0, 10);
  }

  public async load(): Promise<void> {
    const albumTitles = Object.values(AlbumStore);
    for (const title of albumTitles) this.album.set(title, new Map());

    const videos = this.videoService.getAllFiltered('music');

    for (const video of videos) {
      const albumTitle = MusicStore.get(video.title);
      if (!albumTitle) continue;

      const title = video.title;
      const hash = MusicService.hashTitle(title);

      const albumId = MusicService.hashTitle(albumTitle);
      const musicMap = this.album.get(albumTitle)!;

      if (!musicMap.has(hash)) musicMap.set(hash, { title, id: hash, videos: [], albumId });
      musicMap.get(hash)!.videos.push(video);
    }
  }

  @SentryLog('music service', 'get all albums')
  public getAllAlbums(): Album[] {
    const albums: Album[] = [];
    for (const [albumTitle, musicMap] of this.album.entries())
      albums.push({ id: MusicService.hashTitle(albumTitle), title: albumTitle, count: musicMap.size });

    return albums;
  }

  @SentryLog('music service', 'get one album')
  public getOneAlbum(id: string): { album: Album; musics: Music[] } {
    let musicMap: Map<string, Music>;
    let title: string;

    for (const key of this.album.keys()) {
      if (MusicService.hashTitle(key) === id) {
        musicMap = this.album.get(key)!;
        title = key;
        break;
      }
    }

    if (!musicMap! || !title!) throw new NotFoundException();

    const titles = [...MusicStore.keys()];
    const musics = [...musicMap.values()];
    const sortedMusics = musics.sort((a, b) => titles.indexOf(a.title) - titles.indexOf(b.title));

    return { album: { id, title, count: musicMap.size }, musics: sortedMusics };
  }

  @SentryLog('music service', 'get one music')
  public getOneMusic(id: string): Music {
    for (const musicMap of this.album.values()) {
      if (musicMap.has(id)) return musicMap.get(id)!;
    }

    throw new NotFoundException();
  }

  @SentryLog('music service', 'get music by video')
  public getMusicByVideo(video: Video): Music | null {
    for (const musicMap of this.album.values()) {
      for (const music of musicMap.values()) {
        if (music.videos.includes(video)) return music;
      }
    }

    return null;
  }
}

export default MusicService;
