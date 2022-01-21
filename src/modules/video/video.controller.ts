import Controller from '../../classes/controller.class';
import NotFoundException from '../../exceptions/not-found.exception';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import BuilderService from '../builder/builder.service';
import { Path } from '../category/category.response';
import CategoryService from '../category/category.service';
import UploadDto from './dto/upload.dto';
import VideoResponse from './video.response';
import VideoService from './video.service';

class VideoController extends Controller {
  public readonly path: string = '/video';
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly builderService: BuilderService = ServiceProvider.get(BuilderService);
  private readonly categoryService: CategoryService = ServiceProvider.get(CategoryService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(UploadDto), this.upload.bind(this));
    this.mounter.get('/:id', this.stream.bind(this));
    this.mounter.get('/:id/info', this.info.bind(this));
  }

  private async upload(req: TypedRequest<UploadDto>, res: TypedResponse<VideoResponse.Upload>): Promise<void> {
    const video = await this.videoService.upload(req.body);
    res.json({ ok: true, id: video.id });
  }

  private async stream(req: TypedRequest, res: TypedResponse<VideoResponse.Stream>): Promise<void> {
    const id = req.params.id;
    const quality = req.query.quality ? parseInt(req.query.quality) : 1080;
    const info = await this.videoService.getStreamingInfo(id, quality);
    const duration = this.builderService.getDuration(id);
    res.json({ ok: true, url: info.url, quality: info.quality, qualities: info.qualities, duration });
  }

  private async info(req: TypedRequest, res: TypedResponse<VideoResponse.Info>): Promise<void> {
    const id = req.params.id;
    const video = this.videoService.get(id);
    if (!video) throw new NotFoundException();

    const path: Path[] = [];
    const currentCategory: string[] = [];
    for (const category of video.category) {
      currentCategory.push(category);
      const hash = CategoryService.hashPath(...currentCategory);
      const categoryData = this.categoryService.view(hash)!;
      path.push({ name: category, path: hash, count: categoryData.data.length });
    }

    res.json({
      ok: true,
      title: video.title,
      description: video.description,
      duration: video.duration,
      date: video.date.getTime(),
      path,
    });
  }
}

export default VideoController;
