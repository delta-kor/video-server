import Controller from '../../classes/controller.class';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import ManageGuard from '../../guards/manage.guard';
import ServiceProvider from '../../services/provider.service';
import EnvService from './env.service';

class EnvController extends Controller {
  public readonly path: string = '/env';
  private readonly envService: EnvService = ServiceProvider.get(EnvService);

  protected mount(): void {
    this.mounter.get('/:key', ManageGuard, this.update.bind(this));
  }

  private async update(req: TypedRequest, res: TypedResponse): Promise<void> {
    const key: string = req.params.key;
    const value: string = req.query.value;
    if (!key || !value) throw new UnprocessableEntityException('잘못된 요청이에요');
    const result = await this.envService.set(key, value);
    console.log(`Env Set :: ${key} -> ${result}`);
    res.json({ ok: true });
  }
}

export default EnvController;
