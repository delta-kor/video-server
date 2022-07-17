import Controller from '../../classes/controller.class';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import PlaytimeDto from './dto/playtime.dto';
import RecommendResponse from './recommend.response';
import RecommendService from './service/recommend.service';

class RecommendController extends Controller {
  public readonly path: string = '/recommend';
  private readonly recommendService: RecommendService = ServiceProvider.get(RecommendService);

  protected mount(): void {
    this.mounter.get('/:id', this.getVideoRecommends.bind(this));
    this.mounter.post('/', ValidateGuard(PlaytimeDto), this.getUserRecommends.bind(this));
    this.mounter.post('/emotion', ValidateGuard(PlaytimeDto), this.getEmotion.bind(this));
  }

  private async getVideoRecommends(
    req: TypedRequest,
    res: TypedResponse<RecommendResponse.GetVideoRecommends>
  ): Promise<void> {
    const id = req.params.id;
    const count = parseInt(req.query.count) || 12;

    if (count > 50) throw new UnprocessableEntityException('허용되지 않은 범위이에요');

    const videos = this.recommendService.getVideoRecommends(id, count);
    res.json({
      ok: true,
      videos: videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        is_4k: video.is_4k,
      })),
    });
  }

  private async getUserRecommends(
    req: TypedRequest<PlaytimeDto>,
    res: TypedResponse<RecommendResponse.GetUserRecommends>
  ): Promise<void> {
    const count = parseInt(req.query.count) || 20;

    if (count > 50) throw new UnprocessableEntityException('허용되지 않은 범위이에요');

    const data = req.body.data;
    const recommends = this.recommendService.getUserRecommends(data, count);
    const videos = recommends[0];
    const emotion = recommends[1];

    res.json({
      ok: true,
      videos: videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        is_4k: video.is_4k,
      })),
      emotion,
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