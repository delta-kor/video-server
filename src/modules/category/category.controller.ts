import { Document } from 'mongoose';
import Controller from '../../classes/controller.class';
import NotFoundException from '../../exceptions/not-found.exception';
import ServiceProvider from '../../services/provider.service';
import Video from '../video/video.interface';
import { ChildCategory, ParentCategory } from './category.interface';
import CategoryResponse from './category.response';
import CategoryService from './category.service';

class CategoryController extends Controller {
  public readonly path: string = '/category';
  private readonly categoryService: CategoryService = ServiceProvider.get(CategoryService);

  protected mount(): void {
    this.mounter.get('/', this.view.bind(this));
  }

  public async view(
    req: TypedRequest,
    res: TypedResponse<CategoryResponse.Parent | CategoryResponse.Children>
  ): Promise<any> {
    const hash = req.query.path;
    const data = this.categoryService.view(hash);
    if (!data) throw new NotFoundException();
    if (data[0] instanceof Document) {
      res.json({
        ok: true,
        type: 'children',
        files: (<Video[]>data).map(video => ({ id: video.id, title: video.title, date: video.date.getTime() })),
      });
      return true;
    } else {
      if ('children' in data[0])
        res.json({
          ok: true,
          type: 'parent',
          folders: (<ParentCategory[]>data).map(folder => ({
            title: folder.name,
            path: folder.hash,
            count:
              'children' in Array.from(folder.children.values())[0]
                ? (<ParentCategory[]>Array.from(folder.children.values())).reduce<number>(
                    (acc, current) =>
                      (<ChildCategory[]>Array.from(current.children.values())).reduce<number>(
                        (acc, current) => current.videos.length + acc,
                        0
                      ) + acc,
                    0
                  )
                : (<ChildCategory[]>Array.from(folder.children.values())).reduce<number>(
                    (acc, current) => current.videos.length + acc,
                    0
                  ),
          })),
        });
      else
        res.json({
          ok: true,
          type: 'parent',
          folders: (<ChildCategory[]>data).map(folder => ({
            title: folder.name,
            path: folder.hash,
            count: folder.videos.length,
          })),
        });
      return true;
    }
  }
}

export default CategoryController;
