import Controller from '../../classes/controller.class';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import PlaytimeDto from './dto/playtime.dto';
import RecommendResponse from './recommend.response';
import RecommendService from './service/recommend.service';
import { SentryLog } from '../../decorators/sentry.decorator';

class RecommendController extends Controller {
  public readonly path: string = '/recommend';
  private readonly recommendService: RecommendService = ServiceProvider.get(RecommendService);

  protected mount(): void {
    this.mounter.get('/:id', this.getVideoRecommends.bind(this));
    this.mounter.post('/', ValidateGuard(PlaytimeDto), this.getUserRecommends.bind(this));
    this.mounter.post('/emotion', ValidateGuard(PlaytimeDto), this.getEmotion.bind(this));
  }

  @SentryLog('recommend controller', 'get video recommends')
  private async getVideoRecommends(
    req: TypedRequest,
    res: TypedResponse<RecommendResponse.GetVideoRecommends>
  ): Promise<void> {
    const id = req.params.id;
    const count = parseInt(req.query.count) || 12;

    if (count > 50 || count < 1) throw new UnprocessableEntityException('허용되지 않은 범위이에요');

    const videos = this.recommendService.getVideoRecommends(id, count);
    const serializedVideos = videos.map(video =>
      video.serialize(req, 'id', 'title', 'description', 'duration', 'properties')
    );

    res.json({
      ok: true,
      videos: serializedVideos,
    });
  }

  @SentryLog('recommend controller', 'get user recommends')
  private async getUserRecommends(
    req: TypedRequest<PlaytimeDto>,
    res: TypedResponse<RecommendResponse.GetUserRecommends>
  ): Promise<void> {
    const count = parseInt(req.query.count) || 20;

    if (count > 50 || count < 1) throw new UnprocessableEntityException('허용되지 않은 범위이에요');

    const playtime = req.body.data;

    const recommends = this.recommendService.getUserRecommends(playtime, count);
    const serializedVideos = recommends.map(video =>
      video.serialize(req, 'id', 'title', 'description', 'duration', 'properties')
    );

    res.json({
      ok: true,
      videos: serializedVideos,
    });
  }

  private async getEmotion(
    req: TypedRequest<PlaytimeDto>,
    res: TypedResponse<RecommendResponse.GetEmotion>
  ): Promise<void> {
    const emotion = this.recommendService.getEmotionData(req.body.data);
    res.json({ ok: true, emotion });
  }
}

export default RecommendController;
