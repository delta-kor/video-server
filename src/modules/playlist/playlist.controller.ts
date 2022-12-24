import { NextFunction } from 'express';
import Controller from '../../classes/controller.class';
import Constants from '../../constants';
import NotFoundException from '../../exceptions/not-found.exception';
import AuthGuard from '../../guards/auth.guard';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import UserService from '../user/user.service';
import { VideoType } from '../video/video.interface';
import VideoService from '../video/video.service';
import PlaylistDto from './dto/playlist.dto';
import { CreateUserPlaylistDto, UpdateUserPlaylistRequest } from './dto/user-playlist.dto';
import Playlist from './interface/playlist.interface';
import PlaylistResponse from './playlist.response';
import PlaylistService from './playlist.service';

class PlaylistController extends Controller {
  public readonly path: string = '/playlist';
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly userService: UserService = ServiceProvider.get(UserService);
  private readonly playlistService: PlaylistService = ServiceProvider.get(PlaylistService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(PlaylistDto), this.create.bind(this));
    this.mounter.get('/:type', AuthGuard(false), this.readAll.bind(this));
    this.mounter.get('/:type/featured', this.readFeatured.bind(this));
    this.mounter.get('/:id', AuthGuard(false), this.read.bind(this));
    this.mounter.put('/:id', ManageGuard, ValidateGuard(PlaylistDto, 'body', true), this.update.bind(this));
    this.mounter.delete('/:id', ManageGuard, this.delete.bind(this));

    this.mounter.post(
      '/user',
      AuthGuard(false),
      ValidateGuard(CreateUserPlaylistDto),
      this.createUserPlaylist.bind(this)
    );
    this.mounter.post('/user/:id', AuthGuard(false), this.updateUserPlaylist.bind(this));
    this.mounter.delete('/user/:id', AuthGuard(false), this.deleteUserPlaylist.bind(this));
  }

  private async create(req: TypedRequest<PlaylistDto>, res: TypedResponse<PlaylistResponse.Create>): Promise<void> {
    const playlist = await this.playlistService.create(req.body);
    res.json({ ok: true, id: playlist.id });
  }

  private async read(req: TypedRequest, res: TypedResponse<PlaylistResponse.Read>): Promise<void> {
    const user = req.user!;
    const id: string = req.params.id;

    let playlist: Playlist;
    let access: boolean = false;

    if (id.length === 8) {
      playlist = await this.playlistService.read(id, user);
    } else {
      const userPlaylist = await this.playlistService.readUserPlaylist(id);
      const playlistUser = await this.userService.getUserById(userPlaylist.user_id);
      const nickname = playlistUser?.nickname || 'Unknown';

      playlist = userPlaylist.toPlaylist(nickname);
      access = userPlaylist.user_id === user.id;
    }

    const serializedPlaylist = playlist.serialize(req, 'id', 'title', 'description', 'video', 'thumbnail');

    res.json({ ok: true, playlist: serializedPlaylist, access });
  }

  private async readAll(
    req: TypedRequest<any, { data: 'default' | 'full' }, { type: VideoType & 'user' }>,
    res: TypedResponse<PlaylistResponse.ReadAll>,
    next: NextFunction
  ): Promise<void> {
    const user = req.user!;
    const data = req.query.data || 'default';
    const type = req.params.type;

    if (type === 'user') {
      const playlists = await this.playlistService.readUserPlaylists(user);
      const serializedPlaylists = playlists.map(playlist =>
        playlist.serialize(req, 'id', 'title', 'thumbnail', 'count')
      );

      res.json({ ok: true, playlists: serializedPlaylists });
      return;
    }

    if (!Constants.VIDEO_TYPES.includes(type)) return next();

    const playlists = await this.playlistService.readAll(type, user);
    const serializedPlaylist = playlists.map(playlist =>
      data === 'default'
        ? playlist.serialize(req, 'id', 'title', 'thumbnail', 'count')
        : playlist.serialize(req, 'id', 'title', 'description', 'video')
    );

    res.json({ ok: true, playlists: serializedPlaylist });
  }

  private async readFeatured(req: TypedRequest, res: TypedResponse<PlaylistResponse.ReadFeatured>): Promise<void> {
    const type = req.params.type as VideoType;
    if (!Constants.VIDEO_TYPES.includes(type)) throw new NotFoundException();

    const featured = this.playlistService.readFeatured(type);

    const video = featured.video;
    const serializedVideo = video.serialize(req, 'id', 'title', 'description');

    const playlistId = featured.playlist.id;

    const streamingInfo = await this.videoService.getStreamingInfo(video.id, 1080);
    const url = streamingInfo.url;

    res.json({ ok: true, playlist_id: playlistId, video: serializedVideo, url });
  }

  private async update(
    req: TypedRequest<Partial<PlaylistDto>>,
    res: TypedResponse<PlaylistResponse.Update>
  ): Promise<void> {
    const id: string = req.params.id;
    const playlist = await this.playlistService.update(id, req.body);
    const serializedPlaylist = playlist.serialize(
      req,
      'id',
      'label',
      'type',
      'title',
      'description',
      'video',
      'featured',
      'order'
    );

    res.json({ ok: true, playlist: serializedPlaylist });
  }

  private async delete(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id: string = req.params.id;
    await this.playlistService.delete(id);
    res.json({ ok: true });
  }

  private async createUserPlaylist(
    req: TypedRequest<CreateUserPlaylistDto>,
    res: TypedResponse<PlaylistResponse.CreateUserPlaylist>
  ): Promise<void> {
    const user = req.user!;
    const title = req.body.title;
    const playlist = await this.playlistService.createUserPlaylist(user, title);

    res.json({ ok: true, id: playlist.id });
  }

  private async updateUserPlaylist(
    req: TypedRequest<UpdateUserPlaylistRequest>,
    res: TypedResponse<PlaylistResponse.UpdateUserPlaylist>
  ): Promise<void> {
    const user = req.user!;
    const playlistId = req.params.id;
    const userPlaylist = await this.playlistService.updateUserPlaylist(user, playlistId, req.body);
    const playlist = userPlaylist.toPlaylist(user.nickname);
    const serializedPlaylist = playlist.serialize(req, 'id', 'title', 'description', 'video', 'thumbnail');

    res.json({ ok: true, playlist: serializedPlaylist });
  }

  private async deleteUserPlaylist(req: TypedRequest, res: TypedResponse): Promise<void> {
    const user = req.user!;
    const playlistId = req.params.id;
    await this.playlistService.deleteUserPlaylist(user, playlistId);

    res.json({ ok: true });
  }
}

export default PlaylistController;
