import NotFoundException from '../../../exceptions/not-found.exception';
import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import { pickFromArray, pickFromSetAndDelete } from '../../../utils/pick.util';
import CategoryService from '../../category/category.service';
import Video from '../../video/video.interface';
import VideoService from '../../video/video.service';
import { EmotionData, PlaytimeData } from '../store/emotion.store';
import EmotionService from './emotion.service';

class RecommendService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly categoryService: CategoryService = ServiceProvider.get(CategoryService);
  private readonly emotionService: EmotionService = ServiceProvider.get(EmotionService);

  public getVideoRecommends(id: string, count: number): Video[] {
    const video = this.videoService.get(id);
    if (!video) throw new NotFoundException();

    const { type, title, category } = video;

    const result: Video[] = [];
    const categoryVideos = this.categoryService.getVideosByCategory(category);
    const currentIndex = categoryVideos.indexOf(video);

    if (categoryVideos.length >= 2 && currentIndex !== -1) {
      const nextIndex = categoryVideos.length - 1 === currentIndex ? 0 : currentIndex + 1;
      const nextVideo = categoryVideos[nextIndex];
      if (nextVideo) result.push(nextVideo);
    }

    if (video.type === 'vod') {
      const intros = new Set(this.categoryService.getVodIntros());
      for (let i = 0; i < count - 1; i++) {
        if (!intros.size) continue;

        const video = pickFromSetAndDelete(intros);
        if (result.includes(video)) {
          i--;
          continue;
        }

        result.push(video);
      }
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
