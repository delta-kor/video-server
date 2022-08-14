import crypto from 'crypto';
import Constants from '../../constants';
import NotFoundException from '../../exceptions/not-found.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import ArrayMap from '../../utils/arraymap.util';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';
import CategoryResponse, { Folder, Path } from './category.response';

class CategoryService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly folders: Map<string, Folder> = new Map();
  private readonly folderItems: ArrayMap<string, Folder> = new ArrayMap();
  private readonly fileItems: ArrayMap<string, Video> = new ArrayMap();
  private readonly vodIntros: Video[] = [];

  private static hashPath(path: string[]): string {
    const hasher = crypto.createHash('md5');
    for (const item of path) hasher.update(item);
    return hasher.digest('hex').slice(0, 16);
  }

  private static hashMultiplePath(paths: string[]): string[] {
    const result: string[] = [];
    for (let i = 0; i < paths.length; i++) {
      const path = paths.slice(0, i + 1);
      result.push(CategoryService.hashPath(path));
    }

    return result;
  }

  public createPath(paths: string[]): Path[] {
    return paths.map(id => {
      const parentFolder = this.folders.get(id)!;
      const children = this.folderItems.get(parentFolder.id)?.length ?? parentFolder.count;
      return { id, title: parentFolder.title, count: parentFolder.count, children };
    });
  }

  public createPathFromCategory(category: string[]): Path[] {
    const paths = CategoryService.hashMultiplePath(category);
    return this.createPath(paths);
  }

  private addFolder(path: string[], video: Video): void {
    const folderHash = CategoryService.hashPath(path);

    let folder: Folder | undefined = this.folders.get(folderHash);
    if (!folder) {
      folder = {
        id: folderHash,
        path: CategoryService.hashMultiplePath(path),
        title: path[path.length - 1],
        count: 0,
        children: Constants.CATEGORY_CHILDREN_COUNT,
        date: video.date.getTime(),
      };
      this.folders.set(folderHash, folder);

      if (video.type === 'vod') this.vodIntros.push(video);
    }

    folder.count++;

    const parentFolder = path.slice(0, path.length - 1);
    const parentFolderHash = parentFolder.length === 0 ? 'root' : CategoryService.hashPath(parentFolder);

    if (path.length === Constants.CATEGORY_LENGTH) this.fileItems.add(folderHash, video);
    this.folderItems.add(parentFolderHash, folder);
  }

  public async load(): Promise<void> {
    const videos = this.videoService.getAllFiltered('category');

    for (const video of videos) {
      for (let i = 0; i < Constants.CATEGORY_LENGTH; i++) {
        const target = video.category.slice(0, i + 1);
        this.addFolder(target, video);
      }
    }
  }

  public view(pathId: string = 'root'): CategoryResponse.View {
    const itemFolders = this.folderItems.get(pathId);
    const itemFiles = this.fileItems.get(pathId);

    const folder = this.folders.get(pathId);
    const path: Path[] = !folder ? [] : this.createPath(folder.path);

    if (itemFolders)
      return {
        ok: true,
        type: 'folder',
        path,
        data: itemFolders.map(item => ({
          id: item.id,
          title: item.title,
          count: item.count,
          children: this.folderItems.get(item.id)?.length ?? item.count,
          date: item.date,
        })),
      };

    if (itemFiles)
      return {
        ok: true,
        type: 'file',
        path,
        data: itemFiles.map(video => video.serialize('id', 'title', 'duration', 'date', 'is_4k')),
      };

    throw new NotFoundException();
  }

  public getVodIntros(): Video[] {
    return this.vodIntros;
  }
}

export default CategoryService;
