import NotFoundException from '../../exceptions/not-found.exception';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import pickItem from '../../utils/pick.util';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';
import UploadPlaylistDto from './dto/upload-playlist.dto';
import Playlist from './interface/playlist.interface';
import PlaylistModel from './model/playlist.model';

class FeedService extends Service {
  private readonly playlists: Map<string, Playlist> = new Map();
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);

  public async load(): Promise<void> {
    const playlists: Playlist[] = await PlaylistModel.find();
    for (const playlist of playlists) this.playlists.set(playlist.id, playlist);
  }

  public async uploadPlaylist(data: UploadPlaylistDto): Promise<Playlist> {
    for (const video of data.video) {
      if (!this.videoService.get(video)) throw new UnprocessableEntityException('올바르지 않은 영상 ID이에요');
    }

    const playlist = new PlaylistModel({ title: data.title, video: data.video, featured: data.featured });
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

  public getRecommends(id: string, count: number): Video[] {
    const video = this.videoService.get(id);
    if (!video) throw new NotFoundException();

    const title = video.title;
    const category = video.category;

    const equalTitleVideos = new Set(this.videoService.getByTitle(title));
    const equalCategoryVideos = new Set(this.videoService.getByCategory(category));

    equalTitleVideos.delete(video);
    equalCategoryVideos.delete(video);

    let secondaryCategoryVideos = new Set(),
      tertiaryCategoryVideos = new Set();

    if (equalCategoryVideos.size < count / 2) {
      secondaryCategoryVideos = new Set(this.videoService.getByCategory(category.slice(0, 2)));
      secondaryCategoryVideos.delete(video);
      equalCategoryVideos.forEach(secondaryCategoryVideos.delete, secondaryCategoryVideos);

      if (equalCategoryVideos.size + secondaryCategoryVideos.size < count / 2) {
        tertiaryCategoryVideos = new Set(this.videoService.getByCategory(category.slice(0, 1)));
        tertiaryCategoryVideos.delete(video);
        equalCategoryVideos.forEach(tertiaryCategoryVideos.delete, tertiaryCategoryVideos);
        secondaryCategoryVideos.forEach(tertiaryCategoryVideos.delete, tertiaryCategoryVideos);
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
}

export default FeedService;
