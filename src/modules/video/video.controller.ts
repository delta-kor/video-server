import Controller from '../../classes/controller.class';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import UploadDto from './dto/upload.dto';
import VideoService from './video.service';

class VideoController extends Controller {
  public readonly path: string = '/video';
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);

  protected mount() {
    this.mounter.post('/', ValidateGuard(UploadDto), this.upload.bind(this));
  }

  private async upload(req: TypedRequest<UploadDto>, res: TypedResponse<VideoResponse.Upload>): Promise<void> {
    const video = await this.videoService.upload(
      req.body.cdnId,
      req.body.title,
      req.body.date,
      req.body.category,
      req.body.details
    );
    res.json({ ok: true, id: video.id });
  }
}

export default VideoController;
