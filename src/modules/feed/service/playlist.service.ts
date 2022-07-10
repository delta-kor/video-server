import Constants from '../../../constants';
import NotFoundException from '../../../exceptions/not-found.exception';
import UnprocessableEntityException from '../../../exceptions/unprocessable-entity.exception';
import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import Updater from '../../../utils/updater';
import VideoService from '../../video/video.service';
import PlaylistDto from '../dto/playlist.dto';
import Playlist from '../interface/playlist.interface';
import PlaylistModel from '../model/playlist.model';

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

    this.load();
    return playlist;
  }

  public async update(id: string, data: Partial<PlaylistDto>): Promise<Playlist> {
    const playlist = this.playlists.get(id);
    if (!playlist) throw new NotFoundException();

    if (data.type && !Constants.VIDEO_TYPES.includes(data.type))
      throw new UnprocessableEntityException('잘못된 타입이에요');

    const updater = new Updater<PlaylistDto>(playlist);
    updater.update(data, 'label', 'type', 'title', 'description', 'video', 'featured', 'order');
    await updater.save();

    return playlist;
  }

  public async delete(id: string): Promise<void> {
    const playlist = this.playlists.get(id);
    if (!playlist) throw new NotFoundException();

    await playlist.deleteOne();
    this.playlists.delete(id);

    this.load();
  }
}

export default PlaylistService;
