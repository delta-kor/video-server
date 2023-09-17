import path from 'path';
import Controller from '../../classes/controller.class';
import { SentryLog } from '../../decorators/sentry.decorator';
import ServiceProvider from '../../services/provider.service';
import BuilderService from '../builder/builder.service';

class ThumbnailController extends Controller {
  public readonly path: string = '/thumbnail';
  private readonly builderService: BuilderService = ServiceProvider.get(BuilderService);

  protected mount(): void {
    this.mounter.get('/:id', this.get.bind(this));
  }

  @SentryLog('thumbnail controller', 'get thumbnail')
  private async get(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id = req.params.id;
    const uri = this.builderService.getThumbnailData(id);
    const filePath = uri.split(path.sep).slice(-2).join(path.sep).replace(/\\/g, '/');

    res.redirect(`${process.env.IMAGE_CDN_URL}/${filePath}?q=100`);
  }
}

export default ThumbnailController;
