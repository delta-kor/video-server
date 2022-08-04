import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import { pickFromArray } from '../../../utils/pick.util';
import VideoService from '../../video/video.service';
import EmotionStore, { EmotionData, PlaytimeData } from '../store/emotion.store';

class EmotionService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);

  public getEmotionData(data: PlaytimeData): EmotionData {
    if (data.length === 0) return [0.25, 0.25, 0.25, 0.25];

    const result: EmotionData = [0, 0, 0, 0];

    for (const item of data) {
      const [id, playtime] = item;

      const video = this.videoService.get(id);
      if (!video) continue;

      const title = video.title;
      const emotionData = EmotionStore.get(title);
      if (!emotionData) continue;

      for (let i = 0; i < 4; i++) {
        result[i] += emotionData[i] * playtime;
      }
    }

    const total = result.reduce((a, b) => a + b, 0);
    const differenceRatio = result.map(item => item / total);

    return differenceRatio as EmotionData;
  }

  public pickOne(emotion: number): string {
    const title: string[] = [];
    const point: number[] = [];
    for (const item of EmotionStore) {
      title.push(item[0]);
      point.push(item[1][emotion]);
    }

    const candidates: string[] = [];
    for (let i = 0; i < point.length; i++) {
      const target = title[i];
      const count = point[i];
      for (let j = 0; j < count; j++) candidates.push(target);
    }

    return pickFromArray(candidates);
  }
}

export default EmotionService;
