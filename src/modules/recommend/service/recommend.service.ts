import NotFoundException from '../../../exceptions/not-found.exception';
import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import { pickFromArray, pickFromSetAndDelete } from '../../../utils/pick.util';
import Video from '../../video/video.interface';
import VideoService from '../../video/video.service';
import { EmotionData, PlaytimeData } from '../store/emotion.store';
import EmotionService from './emotion.service';

class RecommendService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly emotionService: EmotionService = ServiceProvider.get(EmotionService);

  public getVideoRecommends(id: string, count: number): Video[] {
    const video = this.videoService.get(id);
    if (!video) throw new NotFoundException();

    const title = video.title;
    const category = video.category;

    const equalTitleVideos = new Set(this.videoService.getByTitle(title));
    const equalCategoryVideos = new Set(this.videoService.getByCategory(category));

    equalTitleVideos.delete(video);
    equalCategoryVideos.delete(video);
    equalTitleVideos.forEach(equalCategoryVideos.delete, equalCategoryVideos);

    let secondaryCategoryVideos = new Set(),
      tertiaryCategoryVideos = new Set();

    if (equalCategoryVideos.size < count / 2) {
      secondaryCategoryVideos = new Set(this.videoService.getByCategory(category.slice(0, 2)));
      secondaryCategoryVideos.delete(video);
      equalCategoryVideos.forEach(secondaryCategoryVideos.delete, secondaryCategoryVideos);
      equalTitleVideos.forEach(secondaryCategoryVideos.delete, secondaryCategoryVideos);

      if (equalCategoryVideos.size + secondaryCategoryVideos.size < count / 2) {
        tertiaryCategoryVideos = new Set(this.videoService.getByCategory(category.slice(0, 1)));
        tertiaryCategoryVideos.delete(video);
        equalCategoryVideos.forEach(tertiaryCategoryVideos.delete, tertiaryCategoryVideos);
        secondaryCategoryVideos.forEach(tertiaryCategoryVideos.delete, tertiaryCategoryVideos);
        equalTitleVideos.forEach(tertiaryCategoryVideos.delete, tertiaryCategoryVideos);
      }
    }

    const result: Video[] = [];
    for (let i = 0; i < count; i++) {
      if (i % 2 === 0) {
        const item =
          pickFromSetAndDelete(equalTitleVideos) ||
          pickFromSetAndDelete(equalCategoryVideos) ||
          pickFromSetAndDelete(secondaryCategoryVideos) ||
          pickFromSetAndDelete(tertiaryCategoryVideos);
        item && result.push(item);
      } else {
        const item =
          pickFromSetAndDelete(equalCategoryVideos) ||
          pickFromSetAndDelete(secondaryCategoryVideos) ||
          pickFromSetAndDelete(tertiaryCategoryVideos) ||
          pickFromSetAndDelete(equalTitleVideos);
        item && result.push(item);
      }
    }

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  public getUserRecommends(data: PlaytimeData, count: number): Video[] {
    const result: Video[] = [];
    const emotionData = this.emotionService.getEmotionData(data);

    const emotionalVideoCount: [number, number][] = [];
    for (let i = 0; i < 4; i++) emotionalVideoCount.push([i, Math.round(count * emotionData[i])]);

    const sortedEmotionalVideoCount = emotionalVideoCount.sort((a, b) => b[1] - a[1]);
    const titles: string[] = [];
    for (const count of sortedEmotionalVideoCount) {
      for (let i = 0; i < count[1]; i++) titles.push(this.emotionService.pickOne(count[0]));
    }

    for (const title of titles) {
      const videos = this.videoService.getByTitle(title, 'recommend').filter(video => !result.includes(video));
      if (!videos.length) continue;

      const video = pickFromArray(videos);
      result.push(video);
    }

    return result;
  }

  public getEmotionData(data: PlaytimeData): EmotionData {
    return this.emotionService.getEmotionData(data);
  }
}

export default RecommendService;
