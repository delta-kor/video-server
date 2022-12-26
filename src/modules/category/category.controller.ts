import Controller from '../../classes/controller.class';
import ServiceProvider from '../../services/provider.service';
import CategoryService from './category.service';

class CategoryController extends Controller {
  public readonly path: string = '/category';
  private readonly categoryService: CategoryService = ServiceProvider.get(CategoryService);

  protected mount(): void {
    this.mounter.get('/', this.view.bind(this));
    this.mounter.get('/:path', this.view.bind(this));
  }

  public async view(req: TypedRequest, res: TypedResponse<any>): Promise<void> {
    const pathId: string = req.params.path;
    const data = this.categoryService.view(req, pathId);
    res.json(data);
  }
}

export default CategoryController;
