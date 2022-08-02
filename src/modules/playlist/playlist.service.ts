import Constants from '../../constants';
import NotFoundException from '../../exceptions/not-found.exception';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import { pickFromArray } from '../../utils/pick.util';
import Updater from '../../utils/updater';
import Video, { VideoType } from '../video/video.interface';
import VideoService from '../video/video.service';
import PlaylistDto from './dto/playlist.dto';
import Playlist from './playlist.interface';
import PlaylistModel from './playlist.model';

class PlaylistService extends Service {
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly playlists: Map<string, Playlist> = new Map();

  public async load(): Promise<void> {
    this.playlists.clear();
    const playlists: Playlist[] = await PlaylistModel.find().sort({ order: 1 });
    for (const playlist of playlists) this.playlists.set(playlist.id, playlist);
  }

  public async create(data: PlaylistDto): Promise<Playlist> {
    if (!Constants.VIDEO_TYPES.includes(data.type)) throw new UnprocessableEntityException('잘못된 타입이에요');

    for (const video of data.video) {
      if (!this.videoService.get(video)) throw new UnprocessableEntityException('올바르지 않은 영상 ID이에요');
    }

    const playlist = new PlaylistModel({
      label: data.label,
      type: data.type,
      title: data.title,
      description: data.description,
      video: data.video,
      featured: data.featured,
      order: data.order,
    });
    await playlist.save();

    this.playlists.set(playlist.id, playlist);

    await this.load();
    return playlist;
  }

  public read(id: string): Playlist {
    const playlist = this.playlists.get(id);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  public readAll(type: VideoType): Playlist[] {
    const result: Playlist[] = [];
    for (const item of this.playlists.values()) {
      if (item.type === type && !item.featured) result.push(item);
    }

    return result;
  }

  public readFeatured(type: VideoType): { video: Video; playlist: Playlist } {
    for (const item of this.playlists.values()) {
      if (item.type === type && item.featured) {
        switch (type) {
          case 'performance': {
            const videoId = pickFromArray(item.video);
            const video = this.videoService.get(videoId);
            if (!video) throw new ReferenceError('Video id not found in featured playlist');

            return { video, playlist: item };
          }
          case 'vod': {
            const videoId = item.video[0];
            const video = this.videoService.get(videoId);
            if (!video) throw new ReferenceError('Video id not found in featured playlist');

            return { video, playlist: item };
          }
        }
      }
    }

    throw new ReferenceError('No featured playlist in database');
  }

  public async update(id: string, data: Partial<PlaylistDto>): Promise<Playlist> {
    const playlist = this.read(id);

    if (data.type && !Constants.VIDEO_TYPES.includes(data.type))
      throw new UnprocessableEntityException('잘못된 타입이에요');

    const updater = new Updater<PlaylistDto>(playlist);
    updater.update(data, 'label', 'type', 'title', 'description', 'video', 'featured', 'order');
    await updater.save();

    await this.load();
    return playlist;
  }

  public async delete(id: string): Promise<void> {
    const playlist = this.read(id);

    await playlist.deleteOne();
    this.playlists.delete(id);

    await this.load();
  }
}

export default PlaylistService;
