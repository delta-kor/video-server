import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import CdnService from '../cdn/cdn.service';
import UploadDto from './dto/upload.dto';
import Video from './video.interface';
import VideoModel from './video.model';

class VideoService extends Service {
  private readonly cdnService: CdnService = ServiceProvider.get(CdnService);

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
    return this.cdnService.getCdnUrl(cdnId, quality);
  }
}

export default VideoService;
