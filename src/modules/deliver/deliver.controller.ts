import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import DeliverService from './deliver.service';

class DeliverController extends Controller {
  public readonly path: string = '/deliver';
  private readonly deliverService: DeliverService = ServiceProvider.get(DeliverService);

  protected mount(): void {
    this.mounter.get('/:cdnId', this.get.bind(this));
  }

  private async get(req: TypedRequest, res: TypedResponse): Promise<void> {
    const cdnId: string = req.params.cdnId;
    const quality: number = parseInt(req.query.quality || '1080');

    const cdnInfo = await this.deliverService.getCdnInfo(cdnId, quality);
    res.redirect(cdnInfo.url);
  }
}

export default DeliverController;
