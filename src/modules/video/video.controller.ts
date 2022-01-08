import Controller from '../../classes/controller.class';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import BuilderService from '../builder/builder.service';
import UploadDto from './dto/upload.dto';
import VideoService from './video.service';

class VideoController extends Controller {
  public readonly path: string = '/video';
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly builderService: BuilderService = ServiceProvider.get(BuilderService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(UploadDto), this.upload.bind(this));
    this.mounter.get('/:id', this.stream.bind(this));
  }

  private async upload(req: TypedRequest<UploadDto>, res: TypedResponse<VideoResponse.Upload>): Promise<void> {
    const video = await this.videoService.upload(req.body);
    res.json({ ok: true, id: video.id });
  }

  private async stream(req: TypedRequest, res: TypedResponse<VideoResponse.Stream>): Promise<void> {
    const id = req.params.id;
    const quality = req.query.quality ? parseInt(req.query.quality) : 1080;
    const url = await this.videoService.getStreamingUrl(id, quality);
    const duration = this.builderService.getDuration(id);
    res.json({ ok: true, url, duration });
  }
}

export default VideoController;
