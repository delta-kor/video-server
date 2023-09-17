import { SentryLog } from '../../decorators/sentry.decorator';
import NotFoundException from '../../exceptions/not-found.exception';
import UnavailableVideoException from '../../exceptions/unavailable-video.exception';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import { StreamingInfo } from '../deliver/deliver.interface';
import DeliverService from '../deliver/deliver.service';
import User from '../user/user.interface';
import VideoDto from './dto/video.dto';
import Video, { VideoOption } from './video.interface';
import VideoModel from './video.model';

class VideoService extends Service {
  private readonly deliverService: DeliverService = ServiceProvider.get(DeliverService);
  private readonly videos: Video[] = [];

  public async load(): Promise<void> {
    const videos = await VideoModel.find().sort({ date: 1, _id: 1 });
    this.videos.push(...videos);
  }

  @SentryLog('video service', 'get all videos')
  public getAll(): Video[] {
    return this.videos;
  }

  @SentryLog('video service', 'get all filtered videos')
  public getAllFiltered(option: VideoOption): Video[] {
    return this.getAll().filter(video => video.hasOption(option));
  }

  public async upload(data: VideoDto): Promise<Video> {
    if (!['performance', 'vod', 'vlive'].includes(data.type)) {
      throw new UnprocessableEntityException('error.video.invalid_type');
    }

    const video: Video = new VideoModel({
      cdnId: data.cdnId,
      type: data.type,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      category: data.category,
      options: data.options,
      members: data.members,
    });
    await video.save();

    this.videos.push(video);

    return video;
  }

  @SentryLog('video service', 'get video')
  public get(id: string): Video | null {
    for (const video of this.getAll()) {
      if (video.id === id) return video;
    }
    return null;
  }

  @SentryLog('video service', 'get video by category')
  public getByCategory(category: string[]): Video[] {
    const result: Video[] = [];
    for (const video of this.getAllFiltered('category')) {
      if (category.every((value, index) => video.category[index] === value)) {
        result.push(video);
      }
    }
    return result;
  }

  @SentryLog('video service', 'get video by title')
  public getByTitle(title: string, option?: VideoOption): Video[] {
    const result: Video[] = [];
    for (const video of option ? this.getAllFiltered(option) : this.getAll()) {
      if (video.title === title) result.push(video);
    }
    return result;
  }

  @SentryLog('video service', 'get streaming info')
  public async getStreamingInfo(id: string, quality: number): Promise<StreamingInfo> {
    const video = this.get(id);
    if (!video) throw new NotFoundException();

    try {
      const cdnId = video.properties.includes('4k') ? video.cdnId_4k! : video.cdnId;
      const info = await this.deliverService.getCdnInfo(cdnId, quality);

      if (video.properties.includes('4k')) info.qualities = [2160, 1440, 1080, 720, 540, 360, 240];

      return info;
    } catch (e) {
      throw new UnavailableVideoException();
    }
  }

  @SentryLog('video service', 'get video action')
  public async getAction(id: string, user: User): Promise<{ liked: boolean; total: number }> {
    const video = await this.get(id);
    if (!video) throw new NotFoundException();

    const likedUsers = await video.getLiked();

    return { liked: likedUsers.includes(user.id), total: likedUsers.length };
  }

  @SentryLog('video service', 'like video')
  public async like(id: string, user: User): Promise<{ liked: boolean; total: number }> {
    const video = await this.get(id);
    if (!video) throw new NotFoundException();

    const likedUsers = await video.getLiked();

    let liked: boolean;
    if (likedUsers.includes(user.id)) {
      user.liked = user.liked.filter(liked => liked !== video.id);
      liked = false;
    } else {
      user.liked.push(video.id);
      liked = true;
    }

    await user.save();
    return { liked, total: likedUsers.length };
  }

  @SentryLog('video service', 'video subtitle')
  public async getSubtitle(id: string): Promise<string> {
    const video = await this.get(id);
    if (!video || !video.subtitle) throw new NotFoundException();

    return video.subtitle;
  }

  public async ship(): Promise<Video[]> {
    return VideoModel.find({});
  }
}

export default VideoService;
