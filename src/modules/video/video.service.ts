import Service from '../../services/base.service';
import Video from './video.interface';
import VideoModel from './video.model';

class VideoService extends Service {
  public async upload(cdnId: string, title: string, date: number, category: string, details: string): Promise<Video> {
    const video: Video = new VideoModel({ cdnId, title, date, category, details });
    await video.save();

    return video;
  }
}

export default VideoService;
