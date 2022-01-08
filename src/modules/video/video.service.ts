import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import DeliverService from '../deliver/deliver.service';
import UploadDto from './dto/upload.dto';
import Video from './video.interface';
import VideoModel from './video.model';

class VideoService extends Service {
  private readonly deliverService: DeliverService = ServiceProvider.get(DeliverService);
  public readonly videos: Video[] = [];

  public async load(): Promise<void> {
    const videos = await VideoModel.find();
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

    return video;
  }

  public async getStreamingUrl(id: string, quality: number): Promise<string> {
    const video: Video | null = await VideoModel.findOne({ id });
    if (!video) throw new NotFoundException();

    const cdnId = video.cdnId;
    return this.deliverService.getCdnUrl(cdnId, quality);
  }
}

export default VideoService;
