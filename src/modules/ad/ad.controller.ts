import Controller from '../../classes/controller.class';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import AdResponse from './ad.response';
import AdService from './ad.service';
import AddDto from './dto/add.dto';

class AdController extends Controller {
  public readonly path: string = '/ad';
  private readonly adService: AdService = ServiceProvider.get(AdService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(AddDto), this.add.bind(this));
    this.mounter.get('/', this.getAll.bind(this));
  }

  private async add(req: TypedRequest<AddDto>, res: TypedResponse<AdResponse.Add>): Promise<void> {
    const ad = await this.adService.add(req.body);
    res.json({ ok: true, id: ad.id });
  }

  private async getAll(req: TypedRequest, res: TypedResponse<AdResponse.GetAll>): Promise<void> {
    const ads = this.adService.getAll();
    res.json({ ok: true, ads });
  }
}

export default AdController;
