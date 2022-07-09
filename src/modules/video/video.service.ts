import NotFoundException from '../../exceptions/not-found.exception';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import { StreamingInfo } from '../deliver/deliver.interface';
import DeliverService from '../deliver/deliver.service';
import UploadDto from './dto/upload.dto';
import Video, { VideoOptions } from './video.interface';
import VideoModel from './video.model';

class VideoService extends Service {
  private readonly deliverService: DeliverService = ServiceProvider.get(DeliverService);
  private readonly videos: Video[] = [];

  public async load(): Promise<void> {
    const videos = await VideoModel.find().sort({ date: 1, _id: 1 });
    this.videos.push(...videos);
  }

  private getAll(): Video[] {
    return this.videos;
  }

  public getAllFiltered(option: VideoOptions): Video[] {
    return this.getAll().filter(video => video.hasOption(option));
  }

  public async upload(data: UploadDto): Promise<Video> {
    if (!['performance', 'vod'].includes(data.type)) {
      throw new UnprocessableEntityException('잘못된 영상 타입이에요');
    }

    const video: Video = new VideoModel({
      cdnId: data.cdnId,
      type: data.type,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      category: data.category,
      options: data.options,
    });
    await video.save();

    this.videos.push(video);

    return video;
  }

  public get(id: string): Video | null {
    for (const video of this.getAll()) {
      if (video.id === id) return video;
    }
    return null;
  }

  public getByCategory(category: string[]): Video[] {
    const result: Video[] = [];
    for (const video of this.getAllFiltered('category')) {
      if (category.every((value, index) => video.category[index] === value)) {
        result.push(video);
      }
    }
    return result;
  }

  public getByTitle(title: string, option?: VideoOptions): Video[] {
    const result: Video[] = [];
    for (const video of option ? this.getAllFiltered(option) : this.getAll()) {
      if (video.title === title) result.push(video);
    }
    return result;
  }

  public async getStreamingInfo(id: string, quality: number): Promise<StreamingInfo> {
    const video = this.get(id);
    if (!video) throw new NotFoundException();

    const cdnId = video.is_4k && quality > 1080 ? video.cdnId_4k! : video.cdnId;
    const info = await this.deliverService.getCdnInfo(cdnId, quality);

    if (video.is_4k) info.qualities = [2160, 1440, 1080, 720, 540, 360, 240];

    return info;
  }
}

export default VideoService;
