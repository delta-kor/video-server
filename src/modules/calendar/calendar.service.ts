import { SentryLog } from '../../decorators/sentry.decorator';
import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import ArrayMap from '../../utils/arraymap.util';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';

class CalendarService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private timestamps: ArrayMap<string, Video> = new ArrayMap();

  private static dateToTimestamp(data: Date): string {
    const utc = data.getTime() + data.getTimezoneOffset() * 60 * 1000;
    const date = new Date(utc + 9 * 60 * 60 * 1000);
    const year = date.getFullYear().toString().slice(2).padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
  }

  public async load(): Promise<void> {
    const categoryVideos = this.videoService.getAllFiltered('category');
    const vliveVideos = this.videoService.getVlive();
    const videos = [...new Set([...categoryVideos, ...vliveVideos])];

    for (const video of videos) {
      const timestamp = CalendarService.dateToTimestamp(video.date);
      this.timestamps.add(timestamp, video);
    }
  }

  @SentryLog('calender service', 'get all')
  public getAll(): [string, number][] {
    const result: [string, number][] = [];

    const timestamps = this.timestamps.getAll();
    for (const timestamp of timestamps) {
      result.push([timestamp[0], timestamp[1].length]);
    }

    return result;
  }

  @SentryLog('calender service', 'get all')
  public getOne(timestamp: string): Video[] {
    const videos = this.timestamps.get(timestamp);
    if (!videos) throw new NotFoundException();

    return videos;
  }
}

export default CalendarService;
