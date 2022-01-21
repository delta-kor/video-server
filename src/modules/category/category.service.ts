import crypto from 'crypto';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';
import { ChildCategory, ParentCategory } from './category.interface';
import { Path } from './category.response';

class CategoryService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private category!: Map<string, ParentCategory>;

  public static hashPath(...path: string[]): string {
    const hasher = crypto.createHash('md5');
    for (const item of path) hasher.update(item);
    return hasher.digest('hex').slice(0, 16);
  }

  public async load(): Promise<void> {
    const videos = this.videoService.videos;

    const categoriesMap: Map<string, Map<string, Map<string, Video[]>>> = new Map();
    for (const video of videos) {
      const [topCategoryName, middleCategoryName, bottomCategoryName] = video.category;

      if (!categoriesMap.has(topCategoryName)) categoriesMap.set(topCategoryName, new Map());
      const topCategory = categoriesMap.get(topCategoryName)!;

      if (!topCategory.has(middleCategoryName)) topCategory.set(middleCategoryName, new Map());
      const middleCategory = topCategory.get(middleCategoryName)!;

      if (!middleCategory.has(bottomCategoryName)) middleCategory.set(bottomCategoryName, []);
      const bottomList = middleCategory.get(bottomCategoryName)!;

      bottomList.push(video);
    }

    const categories: Map<string, ParentCategory> = new Map();
    for (const [topName, topCategoryMap] of categoriesMap.entries()) {
      const topParentCategory: ParentCategory = {
        name: topName,
        hash: CategoryService.hashPath(topName),
        children: new Map(),
      };
      for (const [middleName, middleCategoryMap] of topCategoryMap.entries()) {
        const middleParentCategory: ParentCategory = {
          name: middleName,
          hash: CategoryService.hashPath(topName, middleName),
          children: new Map(),
        };
        for (const [bottomName, bottomVideos] of middleCategoryMap.entries()) {
          const childCategory: ChildCategory = {
            name: bottomName,
            hash: CategoryService.hashPath(topName, middleName, bottomName),
            videos: bottomVideos,
          };
          middleParentCategory.children.set(bottomName, childCategory);
        }
        topParentCategory.children.set(middleName, middleParentCategory);
      }
      categories.set(topName, topParentCategory);
    }

    this.category = categories;
  }

  public view(hash?: string): { path: Path[]; data: (ParentCategory | ChildCategory | Video)[] } | null {
    if (!hash) return { path: [], data: Array.from(this.category.values()) };
    for (const topCategory of this.category.values()) {
      if (topCategory.hash === hash)
        return {
          path: [{ name: topCategory.name, path: topCategory.hash, count: topCategory.children.size }],
          data: <ParentCategory[]>Array.from(topCategory.children.values()),
        };
      for (const middleCategory of topCategory.children.values()) {
        if (middleCategory.hash === hash)
          return {
            path: [
              { name: topCategory.name, path: topCategory.hash, count: topCategory.children.size },
              {
                name: middleCategory.name,
                path: middleCategory.hash,
                count: (<ParentCategory>middleCategory).children.size,
              },
            ],
            data: <ParentCategory[]>Array.from((<ParentCategory>middleCategory).children.values()),
          };
        for (const bottomCategory of (<ParentCategory>middleCategory).children.values()) {
          if (bottomCategory.hash === hash)
            return {
              path: [
                { name: topCategory.name, path: topCategory.hash, count: topCategory.children.size },
                {
                  name: middleCategory.name,
                  path: middleCategory.hash,
                  count: (<ParentCategory>middleCategory).children.size,
                },
                {
                  name: bottomCategory.name,
                  path: bottomCategory.hash,
                  count: (<ChildCategory>bottomCategory).videos.length,
                },
              ],
              data: Array.from((<ChildCategory>bottomCategory).videos.values()),
            };
        }
      }
    }
    return null;
  }
}

export default CategoryService;
