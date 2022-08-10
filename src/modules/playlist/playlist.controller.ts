import { NextFunction } from 'express';
import Controller from '../../classes/controller.class';
import Constants from '../../constants';
import NotFoundException from '../../exceptions/not-found.exception';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import { VideoType } from '../video/video.interface';
import VideoService from '../video/video.service';
import PlaylistDto from './dto/playlist.dto';
import PlaylistResponse from './playlist.response';
import PlaylistService from './playlist.service';

class PlaylistController extends Controller {
  public readonly path: string = '/playlist';
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);
  private readonly playlistService: PlaylistService = ServiceProvider.get(PlaylistService);

  protected mount(): void {
    this.mounter.post('/', ManageGuard, ValidateGuard(PlaylistDto), this.create.bind(this));
    this.mounter.get('/:type', this.readAll.bind(this));
    this.mounter.get('/:type/featured', this.readFeatured.bind(this));
    this.mounter.get('/:id', this.read.bind(this));
    this.mounter.put('/:id', ManageGuard, ValidateGuard(PlaylistDto, 'body', true), this.update.bind(this));
    this.mounter.delete('/:id', ManageGuard, this.delete.bind(this));
  }

  private async create(req: TypedRequest<PlaylistDto>, res: TypedResponse<PlaylistResponse.Create>): Promise<void> {
    const playlist = await this.playlistService.create(req.body);
    res.json({ ok: true, id: playlist.id });
  }

  private async read(req: TypedRequest, res: TypedResponse<PlaylistResponse.Read>): Promise<void> {
    const id: string = req.params.id;
    const playlist = this.playlistService.read(id);
    const serializedPlaylist = playlist.serialize('id', 'title', 'description', 'video', 'thumbnail');

    res.json({ ok: true, playlist: serializedPlaylist });
  }

  private async readAll(
    req: TypedRequest<any, { data: 'default' | 'full' }, { type: VideoType }>,
    res: TypedResponse<PlaylistResponse.ReadAll>,
    next: NextFunction
  ): Promise<void> {
    const data = req.query.data || 'default';

    const type = req.params.type;
    if (!Constants.VIDEO_TYPES.includes(type)) return next();

    const playlists = this.playlistService.readAll(type);
    const serializedPlaylist = playlists.map(playlist =>
      data === 'default'
        ? playlist.serialize('id', 'title', 'thumbnail')
        : playlist.serialize('id', 'title', 'description', 'video')
    );

    res.json({ ok: true, playlists: serializedPlaylist });
  }

  private async readFeatured(req: TypedRequest, res: TypedResponse<PlaylistResponse.ReadFeatured>): Promise<void> {
    const type = req.params.type as VideoType;
    if (!Constants.VIDEO_TYPES.includes(type)) throw new NotFoundException();

    const featured = this.playlistService.readFeatured(type);

    const video = featured.video;
    const serializedVideo = video.serialize('id', 'title', 'description');

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
}

export default PlaylistController;
