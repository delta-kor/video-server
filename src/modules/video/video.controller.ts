import Controller from '../../classes/controller.class';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import BuilderService from '../builder/builder.service';
import CategoryService from '../category/category.service';
import UploadDto from './dto/upload.dto';
import VideoResponse, { ShortVideoInfo } from './video.response';
import VideoService from './video.service';

class VideoController extends Controller {
  public readonly path: string = '/video';
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly builderService: BuilderService = ServiceProvider.get(BuilderService);
  private readonly categoryService: CategoryService = ServiceProvider.get(CategoryService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(UploadDto), this.upload.bind(this));
    this.mounter.get('/list', this.list.bind(this));
    this.mounter.get('/:id', this.stream.bind(this));
    this.mounter.get('/:id/info', this.info.bind(this));
    this.mounter.get('/:id/beacon', this.beacon.bind(this));
  }

  private async upload(req: TypedRequest<UploadDto>, res: TypedResponse<VideoResponse.Upload>): Promise<void> {
    const video = await this.videoService.upload(req.body);
    res.json({ ok: true, id: video.id });
  }

  private async stream(
    req: TypedRequest<any, { options: string; quality: string }>,
    res: TypedResponse<VideoResponse.Stream>
  ): Promise<void> {
    const id = req.params.id;
    const quality = req.query.quality ? parseInt(req.query.quality) : 1080;

    const info = await this.videoService.getStreamingInfo(id, quality);
    const duration = this.builderService.getVideoDuration(id);

    res.json({ ok: true, url: info.url, quality: info.quality, qualities: info.qualities, duration });
  }

  private async info(req: TypedRequest, res: TypedResponse<VideoResponse.Info>): Promise<void> {
    // const id = req.params.id;
    // const video = this.videoService.get(id);
    // if (!video) throw new NotFoundException();
    //
    // const path: Path[] = [];
    // const currentCategory: string[] = [];
    // for (const category of video.category) {
    //   currentCategory.push(category);
    //   const hash = CategoryService.hashPath(...currentCategory);
    //   const categoryData = this.categoryService.view(hash)!;
    //   path.push({ name: category, path: hash, count: categoryData.data.length });
    // }
    //
    // res.json({
    //   ok: true,
    //   title: video.title,
    //   description: video.description,
    //   duration: video.duration,
    //   date: video.date.getTime(),
    //   path,
    // });
  }

  private async list(req: TypedRequest, res: TypedResponse<VideoResponse.List>): Promise<void> {
    const query = req.query.ids as string;
    if (!query) throw new UnprocessableEntityException('ID를 입력해주세요');

    const ids = query.split(',').map(item => item.trim());
    const list: ShortVideoInfo[] = [];

    for (const id of ids) {
      const video = this.videoService.get(id);
      if (!video) continue;

      list.push({ id, title: video.title, description: video.description, duration: video.duration });
    }

    res.json({ ok: true, data: list });
  }

  private async beacon(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id = req.params.id;
    const time = req.query.time;
    const total = req.query.total;
    console.log(`[${new Date().toLocaleTimeString('en')}] [VIDEO BEACON] ID=${id} T=${time} TT=${total}`);
    res.send();
  }
}

export default VideoController;
