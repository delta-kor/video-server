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
    this.mounter.get('/:path', this.view.bind(this));
  }

  public async view(
    req: TypedRequest,
    res: TypedResponse<CategoryResponse.Parent | CategoryResponse.Children>
  ): Promise<any> {
    const hash = req.params.path;

    const result = this.categoryService.view(hash);
    if (!result) throw new NotFoundException();

    const data = result.data;
    const path = result.path;

    if (data[0] instanceof Document) {
      res.json({
        ok: true,
        type: 'children',
        path,
        files: (<Video[]>data).map(video => ({
          id: video.id,
          title: video.title,
          date: video.date.getTime(),
          duration: video.duration,
          is_4k: video.is_4k,
        })),
      });
      return true;
    } else {
      if ('children' in data[0])
        res.json({
          ok: true,
          type: 'parent',
          path,
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
            children: folder.children.size,
          })),
        });
      else
        res.json({
          ok: true,
          type: 'parent',
          path,
          folders: (<ChildCategory[]>data).map(folder => ({
            title: folder.name,
            path: folder.hash,
            count: folder.videos.length,
            children: folder.videos.length,
          })),
        });
      return true;
    }
  }
}

export default CategoryController;
