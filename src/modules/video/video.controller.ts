import { Response } from 'express';
import Controller from '../../classes/controller.class';
import Queue from '../../decorators/queue.decorator';
import NotFoundException from '../../exceptions/not-found.exception';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import AuthGuard from '../../guards/auth.guard';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import { getVideoCategoryItem, getVideoDescription, getVideoTitle } from '../../utils/i18n.util';
import BuilderService from '../builder/builder.service';
import { Path } from '../category/category.response';
import CategoryService from '../category/category.service';
import MusicService from '../music/music.service';
import VideoDto from './dto/video.dto';
import VideoResponse, { ShortVideoInfo } from './video.response';
import VideoService from './video.service';

class VideoController extends Controller {
  public readonly path: string = '/video';
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly builderService: BuilderService = ServiceProvider.get(BuilderService);
  private readonly categoryService: CategoryService = ServiceProvider.get(CategoryService);
  private readonly musicService: MusicService = ServiceProvider.get(MusicService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(VideoDto), this.upload.bind(this));
    this.mounter.get('/list', this.list.bind(this));
    this.mounter.get('/:id', this.stream.bind(this));
    this.mounter.get('/:id/info', this.info.bind(this));
    this.mounter.get('/:id/beacon', this.beacon.bind(this));
    this.mounter.get('/:id/action', AuthGuard(false), this.action.bind(this));
    this.mounter.post('/:id/like', AuthGuard(false), this.like.bind(this));
    this.mounter.get('/:id/subtitle', this.subtitle.bind(this));
  }

  private async upload(req: TypedRequest<VideoDto>, res: TypedResponse<VideoResponse.Upload>): Promise<void> {
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
    const id = req.params.id;
    const video = this.videoService.get(id);
    if (!video) throw new NotFoundException();

    const path: Path[] = this.categoryService.createPathFromCategory(video.category);
    path.forEach(item => (item.title = getVideoCategoryItem(item.title, req.i18n.resolvedLanguage)));

    const music = this.musicService.getMusicByVideo(video);

    res.json({
      ok: true,
      id: video.id,
      title: getVideoTitle(video.title, req.i18n.resolvedLanguage),
      description: getVideoDescription(video.description, req.i18n.resolvedLanguage),
      duration: video.duration,
      date: video.date.getTime(),
      path,
      properties: video.properties,
      music: music?.id || null,
    });
  }

  private async list(req: TypedRequest, res: TypedResponse<VideoResponse.List>): Promise<void> {
    const query = req.query.ids as string;
    if (!query) throw new UnprocessableEntityException('error.video.enter_id');

    const ids = query.split(',').map(item => item.trim());
    const list: ShortVideoInfo[] = [];

    for (const id of ids) {
      const video = this.videoService.get(id);
      if (!video) continue;

      list.push({
        id,
        title: getVideoTitle(video.title, req.i18n.resolvedLanguage),
        description: getVideoDescription(video.description, req.i18n.resolvedLanguage),
        duration: video.duration,
      });
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

  private async action(req: TypedRequest, res: TypedResponse<VideoResponse.Action>): Promise<void> {
    const id = req.params.id;
    const user = req.user!;

    const { liked, total } = await this.videoService.getAction(id, user);
    res.json({ ok: true, liked, likes_total: total });
  }

  @Queue()
  private async like(req: TypedRequest, res: TypedResponse<VideoResponse.Like>): Promise<void> {
    const id = req.params.id;
    const user = req.user!;

    const { liked, total } = await this.videoService.like(id, user);
    res.json({ ok: true, liked, total });
  }

  private async subtitle(req: TypedRequest, res: Response): Promise<void> {
    const id = req.params.id;
    const subtitle = await this.videoService.getSubtitle(id);

    res.header('Content-Type', 'text/vtt');
    res.send(subtitle);
  }
}

export default VideoController;
