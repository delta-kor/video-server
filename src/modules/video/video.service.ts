import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import { StreamingInfo } from '../deliver/deliver.interface';
import DeliverService from '../deliver/deliver.service';
import UploadDto from './dto/upload.dto';
import Video from './video.interface';
import VideoModel from './video.model';

class VideoService extends Service {
  private readonly deliverService: DeliverService = ServiceProvider.get(DeliverService);
  private readonly videos: Video[] = [];

  public async load(): Promise<void> {
    const videos = await VideoModel.find().sort({ _id: 1, date: 1 });
    this.videos.push(...videos);
  }

  public getAll(privateRequest: boolean = false): Video[] {
    if (privateRequest) return this.videos;
    return this.videos.filter(video => !video.private);
  }

  public async upload(data: UploadDto): Promise<Video> {
    const video: Video = new VideoModel({
      cdnId: data.cdnId,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      category: data.category,
      private: data.private,
    });
    await video.save();

    this.videos.push(video);

    return video;
  }

  public get(id: string, privateRequest: boolean = false): Video | null {
    for (const video of this.getAll(privateRequest)) {
      if (video.id === id) return video;
    }
    return null;
  }

  public getByCategory(category: string[], privateRequest: boolean = false): Video[] {
    const result: Video[] = [];
    for (const video of this.getAll(privateRequest)) {
      if (category.every((value, index) => video.category[index] === value)) {
        result.push(video);
      }
    }
    return result;
  }

  public getByTitle(title: string, privateRequest: boolean = false): Video[] {
    const result: Video[] = [];
    for (const video of this.getAll(privateRequest)) {
      if (video.title === title) result.push(video);
    }
    return result;
  }

  public async getStreamingInfo(id: string, quality: number, privateRequest: boolean = false): Promise<StreamingInfo> {
    const video = this.get(id, privateRequest);
    if (!video) throw new NotFoundException();

    const cdnId = video.is_4k && quality > 1080 ? video.cdnId_4k : video.cdnId;
    const info = await this.deliverService.getCdnInfo(cdnId, quality);

    if (video.is_4k) info.qualities = [2160, 1440, 1080, 720, 540, 360, 240];

    return info;
  }
}

export default VideoService;
