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
  public readonly videos: Video[] = [];

  public async load(): Promise<void> {
    const videos = await VideoModel.find().sort({ _id: 1, date: 1 });
    this.videos.push(...videos);
  }

  public async upload(data: UploadDto): Promise<Video> {
    const video: Video = new VideoModel({
      cdnId: data.cdnId,
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      category: data.category,
    });
    await video.save();

    this.videos.push(video);

    return video;
  }

  public get(id: string): Video | null {
    for (const video of this.videos) {
      if (video.id === id) return video;
    }
    return null;
  }

  public getByCategory(category: string[]): Video[] {
    const result: Video[] = [];
    for (const video of this.videos) {
      if (category.every((value, index) => video.category[index] === value)) {
        result.push(video);
      }
    }
    return result;
  }

  public getByTitle(title: string): Video[] {
    const result: Video[] = [];
    for (const video of this.videos) {
      if (video.title === title) result.push(video);
    }
    return result;
  }

  public async getStreamingInfo(id: string, quality: number): Promise<StreamingInfo> {
    const video = this.get(id);
    if (!video) throw new NotFoundException();

    const cdnId = video.cdnId;
    return this.deliverService.getCdnInfo(cdnId, quality);
  }
}

export default VideoService;
