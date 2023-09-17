import Controller from '../../classes/controller.class';
import { SentryLog } from '../../decorators/sentry.decorator';
import ServiceProvider from '../../services/provider.service';
import VliveResponse from './vlive.response';
import VliveService from './vlive.service';

class VliveController extends Controller {
  public readonly path: string = '/vlive';
  private readonly vliveService: VliveService = ServiceProvider.get(VliveService);

  protected mount(): void {
    this.mounter.get('/list', this.list.bind(this));
  }

  @SentryLog('vlive controller', 'vlive list')
  private async list(req: TypedRequest, res: TypedResponse<VliveResponse.List>): Promise<void> {
    const anchor = req.query.anchor as string;
    const count = parseInt(req.query.count as string) || 0;
    const videos = this.vliveService.getVlive({ anchor, count });
    const serializedVideos = videos.map(video => video.serialize(req, 'id', 'title', 'date', 'members'));

    res.json({ ok: true, videos: serializedVideos });
  }
}

export default VliveController;
