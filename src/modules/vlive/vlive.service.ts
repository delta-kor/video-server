import { SentryLog } from '../../decorators/sentry.decorator';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
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
    const count = filter.count || 10;
    if (count > 100) throw new UnprocessableEntityException('error.wrong_request');

    let videos = this.videoService.getVlive();

    if (filter.members.length) {
      videos = videos.filter(video => video.members?.every(member => filter.members.includes(member)));
    }

    if (filter.sort === 'newest') videos.sort((a, b) => b.date.getTime() - a.date.getTime());
    else videos.sort((a, b) => a.date.getTime() - b.date.getTime());

    if (filter.sort === 'set' && filter.from) videos = videos.filter(video => video.date.getTime() > filter.from!);

    const videoIds = videos.map(videos => videos.id);
    const anchorIndex = videoIds.indexOf(filter.anchor);
    const paginatedVideos = videos.slice(anchorIndex + 1, anchorIndex + count + 1);

    return paginatedVideos;
  }
}

export default VliveService;
