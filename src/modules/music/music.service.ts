import crypto from 'crypto';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import VideoService from '../video/video.service';
import { Album, Music } from './music.interface';
import { AlbumStore, MusicStore } from './music.store';

class MusicService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly album: Map<string, Map<string, Music>> = new Map();

  private static hashTitle(title: string): string {
    const hasher = crypto.createHash('md5');
    hasher.update(title);
    return hasher.digest('hex').slice(0, 8);
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

      const musicMap = this.album.get(albumTitle)!;

      if (!musicMap.has(hash)) musicMap.set(hash, { title, hash, videos: [] });
      musicMap.get(hash)!.videos.push(video);
    }
  }

  public getAllAlbums(): Album[] {
    const albums: Album[] = [];
    for (const [albumTitle, musicMap] of this.album.entries())
      albums.push({ id: MusicService.hashTitle(albumTitle), title: albumTitle, count: musicMap.size });

    return albums;
  }
}

export default MusicService;
