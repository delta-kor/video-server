import Constants from '../../constants';
import NotFoundException from '../../exceptions/not-found.exception';
import UnauthorizedException from '../../exceptions/unauthorized.exception';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import { pickFromArray } from '../../utils/pick.util';
import Updater from '../../utils/updater';
import User from '../user/user.interface';
import Video, { VideoType } from '../video/video.interface';
import VideoService from '../video/video.service';
import PlaylistDto from './dto/playlist.dto';
import { UpdateUserPlaylistRequest } from './dto/user-playlist.dto';
import Playlist from './interface/playlist.interface';
import UserPlaylist from './interface/user-playlist.interface';
import PlaylistModel from './model/playlist.model';
import UserPlaylistModel from './model/user-playlist.model';

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

  public async read(id: string, user?: User): Promise<Playlist> {
    if (id === 'liked' && user) {
      const likedVideos = await user.getLikedVideos();
      if (!likedVideos.length) throw new NotFoundException();
      return PlaylistModel.createLikedPlaylist(likedVideos);
    }

    const playlist = this.playlists.get(id);
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  public async readAll(type: VideoType, user?: User): Promise<Playlist[]> {
    const result: Playlist[] = [];
    for (const item of this.playlists.values()) {
      if (item.type !== type) continue;
      if (item.type === 'performance' && item.featured) continue;
      result.push(item);
    }

    if (type === 'performance' && user) {
      const likedVideos = await user.getLikedVideos();
      if (likedVideos.length > 0) {
        const likedPlaylist = PlaylistModel.createLikedPlaylist(likedVideos);
        result.unshift(likedPlaylist);
      }

      const userPlaylists = await user.getUserPlaylists();
      const playlists = userPlaylists.map(playlist => playlist.toPlaylist(user.nickname));

      result.unshift(...playlists);
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
    const playlist = await this.read(id);

    if (data.type && !Constants.VIDEO_TYPES.includes(data.type))
      throw new UnprocessableEntityException('error.playlist.invalid_type');

    const updater = new Updater<PlaylistDto>(playlist);
    updater.update(data, 'label', 'type', 'title', 'description', 'video', 'featured', 'order');
    await updater.save();

    await this.load();
    return playlist;
  }

  public async delete(id: string): Promise<void> {
    const playlist = await this.read(id);

    await playlist.deleteOne();
    this.playlists.delete(id);

    await this.load();
  }

  public async readUserPlaylist(id: string): Promise<UserPlaylist> {
    const playlist = await UserPlaylistModel.findOne({ id });
    if (!playlist) throw new NotFoundException();

    return playlist;
  }

  public async createUserPlaylist(user: User, title: string): Promise<UserPlaylist> {
    const playlist = new UserPlaylistModel({
      user_id: user.id,
      title,
      video: [],
    });

    await playlist.save();
    return playlist;
  }

  public async updateUserPlaylist(
    user: User,
    playlistId: string,
    request: UpdateUserPlaylistRequest
  ): Promise<UserPlaylist> {
    const playlist = await this.readUserPlaylist(playlistId);
    if (playlist.user_id !== user.id) throw new UnauthorizedException();

    const action = request.action;

    if (action === 'rename') {
      if (typeof request.title !== 'string' || request.title.length === 0)
        throw new UnprocessableEntityException('error.playlist.enter_title');
      if (request.title.length > 50) throw new UnprocessableEntityException('error.playlist.title_too_long');

      playlist.title = request.title;
      await playlist.save();

      return playlist;
    }

    const videoId = request.video_id;
    const video = this.videoService.get(videoId);
    if (!video) throw new NotFoundException();

    if (action === 'add') {
      if (playlist.video.includes(videoId))
        throw new UnprocessableEntityException('error.playlist.video_already_added');

      playlist.video.push(videoId);
      await playlist.save();

      return playlist;
    }

    if (action === 'remove') {
      if (!playlist.video.includes(videoId)) throw new NotFoundException();

      playlist.video = playlist.video.filter(id => id !== videoId);
      await playlist.save();

      return playlist;
    }

    if (action === 'reorder') {
      if (!playlist.video.includes(videoId)) throw new NotFoundException();

      const index = playlist.video.indexOf(videoId);
      playlist.video.splice(index, 1);
      playlist.video.splice(request.order, 0, videoId);
      await playlist.save();

      return playlist;
    }

    throw new UnprocessableEntityException('error.wrong_request');
  }

  public async deleteUserPlaylist(user: User, playlistId: string): Promise<void> {
    const playlist = await this.readUserPlaylist(playlistId);
    if (playlist.user_id !== user.id) throw new UnauthorizedException();

    await playlist.deleteOne();
  }
}

export default PlaylistService;
