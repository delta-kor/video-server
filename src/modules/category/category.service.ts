import crypto from 'crypto';
import Service from '../../services/base.service';
import Video from '../video/video.interface';
import VideoModel from '../video/video.model';
import { ChildCategory, ParentCategory } from './category.interface';

class CategoryService extends Service {
  private category!: Map<string, ParentCategory>;

  public async load(): Promise<void> {
    const videos: Video[] = await VideoModel.find();

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
            videos: bottomVideos.map(v => v.title),
          };
          middleParentCategory.children.set(bottomName, childCategory);
        }
        topParentCategory.children.set(middleName, middleParentCategory);
      }
      categories.set(topName, topParentCategory);
    }

    this.category = categories;
  }

  private static hashPath(...path: string[]): string {
    const hasher = crypto.createHash('md5');
    for (const item of path) hasher.update(item);
    return hasher.digest('base64url');
  }
}

export default CategoryService;
