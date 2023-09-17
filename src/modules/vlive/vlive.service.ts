import { SentryLog } from '../../decorators/sentry.decorator';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';
import { VliveFilter } from './vlive.response';

class VliveService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);

  public async load(): Promise<void> {}

  @SentryLog('video service', 'get vlive videos')
  public getVlive(filter: VliveFilter): Video[] {
    const count = 5;
    const videos = this.videoService.getAll().filter(video => video.type === 'vlive');
    const videoIds = videos.map(videos => videos.id);
    const anchorIndex = videoIds.indexOf(filter.anchor);
    const paginatedVideos = videos.slice(anchorIndex + 1, anchorIndex + count + 1);
    return paginatedVideos;
  }
}

export default VliveService;
