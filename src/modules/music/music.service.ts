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
      if (!this.music.has(title)) this.music.set(title, { title, hash: MusicService.hashTitle(title), videos: [] });

      this.music.get(title)!.videos.push(video);
    }

    console.log(this.music);
  }
}

export default MusicService;
