import NotFoundException from '../../../exceptions/not-found.exception';
import UnprocessableEntityException from '../../../exceptions/unprocessable-entity.exception';
import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import pickItem from '../../../utils/pick.util';
import Video from '../../video/video.interface';
import VideoService from '../../video/video.service';
import UploadPlaylistDto from '../dto/upload-playlist.dto';
import Playlist from '../interface/playlist.interface';
import PlaylistModel from '../model/playlist.model';
import EmotionStore, { EmotionData, PlaytimeData } from '../store/emotion.store';
import EmotionService from './emotion.service';

class FeedService extends Service {
  private readonly playlists: Map<string, Playlist> = new Map();
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly emotionService: EmotionService = ServiceProvider.get(EmotionService);

  public async load(): Promise<void> {
    const playlists: Playlist[] = await PlaylistModel.find().sort({ order: 1 });
    for (const playlist of playlists) this.playlists.set(playlist.id, playlist);
  }

  public async uploadPlaylist(data: UploadPlaylistDto): Promise<Playlist> {
    for (const video of data.video) {
      if (!this.videoService.get(video)) throw new UnprocessableEntityException('올바르지 않은 영상 ID이에요');
    }

    const playlist = new PlaylistModel({
      title: data.title,
      video: data.video,
      featured: data.featured,
      order: data.order,
    });
    await playlist.save();

    this.playlists.set(playlist.id, playlist);

    return playlist;
  }

  public getAllPlaylists(): Playlist[] {
    return Array.from(this.playlists.values());
  }

  public getOnePlaylist(id: string): Playlist {
    const playlist = this.playlists.get(id);
    if (!playlist) throw new NotFoundException();
    return playlist;
  }

  public async deletePlaylist(id: string): Promise<void> {
    const playlist = this.playlists.get(id);
    if (!playlist) throw new NotFoundException();

    await playlist.deleteOne();
    this.playlists.delete(id);
  }

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
          pickItem(equalTitleVideos) ||
          pickItem(equalCategoryVideos) ||
          pickItem(secondaryCategoryVideos) ||
          pickItem(tertiaryCategoryVideos);
        item && result.push(item);
      } else {
        const item =
          pickItem(equalCategoryVideos) ||
          pickItem(secondaryCategoryVideos) ||
          pickItem(tertiaryCategoryVideos) ||
          pickItem(equalTitleVideos);
        item && result.push(item);
      }
    }

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  public getUserRecommends(data: PlaytimeData, count: number = 20): [Video[], EmotionData] {
    const result: Video[] = [];
    const emotionData = this.emotionService.getEmotionData(data);

    if (emotionData.some(value => isNaN(value))) {
      return [[], [0, 0, 0, 0]];
    }

    const emotionalCount = emotionData.map(item => Math.round(item * count));

    if (emotionalCount[0] + emotionalCount[1] > emotionalCount[2] + emotionalCount[3]) {
      emotionalCount[0]++;
      emotionalCount[1]++;
      emotionalCount[2]--;
      emotionalCount[3]--;
    } else {
      emotionalCount[0]--;
      emotionalCount[1]--;
      emotionalCount[2]++;
      emotionalCount[3]++;
    }

    const emotionStoreArray = [];
    for (const item of EmotionStore) {
      emotionStoreArray.push([item[0], ...item[1]]);
    }

    for (let i = emotionStoreArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [emotionStoreArray[i], emotionStoreArray[j]] = [emotionStoreArray[j], emotionStoreArray[i]];
    }

    const titlesSet = new Set<string>();
    const semiResult = [];

    const emotionalCountCopy = [...emotionalCount];

    for (let index = 0; index < 4; index++) {
      const i = emotionalCountCopy.indexOf(Math.max(...emotionalCountCopy));
      emotionalCountCopy[i] = -999;

      const count = emotionalCount[i];
      const sortedTitles = emotionStoreArray
        .filter(item => !titlesSet.has(item[0] as string))
        .sort((a, b) => (b[i + 1] as number) - (a[i + 1] as number));
      const pickedTitles = sortedTitles.slice(0, count).map(item => item[0] as string);
      pickedTitles.forEach(title => titlesSet.add(title));
      semiResult.push(pickedTitles);
    }

    const titles = semiResult.sort((a, b) => b.length - a.length).flat();

    for (const title of titles) {
      const targets = this.videoService.getByTitle(title);
      const video = targets[(targets.length * Math.random()) | 0];
      result.push(video);
    }

    return [result.slice(0, 20), emotionData];
  }
}

export default FeedService;
