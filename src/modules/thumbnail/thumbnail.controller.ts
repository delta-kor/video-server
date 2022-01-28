import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import BuilderService from '../builder/builder.service';

class ThumbnailController extends Controller {
  public readonly path: string = '/thumbnail';
  private readonly builderService: BuilderService = ServiceProvider.get(BuilderService);

  protected mount(): void {
    this.mounter.get('/:id', this.get.bind(this));
  }

  private async get(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id = req.params.id;
    const thumbnail = this.builderService.getThumbnailData(id);
    res.header('Cache-Control', 'public, max-age=604800');
    res.sendFile(thumbnail);
  }
}

export default ThumbnailController;
