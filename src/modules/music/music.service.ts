import crypto from 'crypto';
import Service from '../../services/base.service';
import Video from '../video/video.interface';
import VideoModel from '../video/video.model';
import Music from './music.interface';

class MusicService extends Service {
  private readonly music: Map<string, Music> = new Map();

  private static hashTitle(title: string): string {
    const hasher = crypto.createHash('md5');
    hasher.update(title);
    return hasher.digest('hex').slice(0, 8);
  }

  public async load(): Promise<void> {
    const videos: Video[] = await VideoModel.find();

    for (const video of videos) {
      const title = video.title;
      const hash = MusicService.hashTitle(title);

      if (!this.music.has(hash)) this.music.set(hash, { title, hash, videos: [] });
      this.music.get(hash)!.videos.push(video);
    }
  }

  public viewAll(): Music[] {
    return Array.from(this.music.values());
  }
}

export default MusicService;
