import Controller from '../../classes/controller.class';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import ManageGuard from '../../guards/manage.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import VideoService from '../video/video.service';
import UploadPlaylistDto from './dto/upload-playlist.dto';
import UserRecommendsDto from './dto/user-recommends.dto';
import FeedResponse from './feed.response';
import FeedService from './service/feed.service';

class FeedController extends Controller {
  public readonly path: string = '/feed';
  private readonly feedService: FeedService = ServiceProvider.get(FeedService);
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);

  protected mount(): void {
    this.mounter.get('/playlist', this.getAllPlaylists.bind(this));
    this.mounter.post('/playlist', ValidateGuard(UploadPlaylistDto), this.uploadPlaylist.bind(this));
    this.mounter.get('/playlist/:id', this.getOnePlaylist.bind(this));
    this.mounter.delete('/playlist/:id', ManageGuard, this.deletePlaylist.bind(this));
    this.mounter.get('/recommends/:id', this.getVideoRecommends.bind(this));
    this.mounter.post('/recommends', ValidateGuard(UserRecommendsDto), this.getUserRecommends.bind(this));
    this.mounter.post('/emotion', ValidateGuard(UserRecommendsDto), this.getEmotion.bind(this));
  }

  private async uploadPlaylist(
    req: TypedRequest<UploadPlaylistDto>,
    res: TypedResponse<FeedResponse.UploadPlaylist>
  ): Promise<void> {
    const playlist = await this.feedService.uploadPlaylist(req.body);
    const id = playlist.id;
    res.json({ ok: true, id });
  }

  private async getAllPlaylists(_req: TypedRequest, res: TypedResponse<FeedResponse.GetAllPlaylists>): Promise<void> {
    const playlists = this.feedService.getAllPlaylists();
    res.json({
      ok: true,
      playlists: playlists.map(playlist => ({
        id: playlist.id,
        title: playlist.title,
        videos: playlist.video.map(id => {
          const video = this.videoService.get(id)!;
          return {
            id: video.id,
            title: video.title,
            description: video.description,
            duration: video.duration,
            is_4k: video.is_4k,
          };
        }),
        featured: playlist.featured,
      })),
    });
  }

  private async getOnePlaylist(req: TypedRequest, res: TypedResponse<FeedResponse.GetOnePlaylist>): Promise<void> {
    const id = req.params.id;
    const playlist = this.feedService.getOnePlaylist(id);
    res.json({
      ok: true,
      id: playlist.id,
      title: playlist.title,
      videos: playlist.video.map(id => {
        const video = this.videoService.get(id)!;
        return {
          id: video.id,
          title: video.title,
          description: video.description,
          duration: video.duration,
          is_4k: video.is_4k,
        };
      }),
      featured: playlist.featured,
    });
  }

  private async deletePlaylist(req: TypedRequest, res: TypedResponse): Promise<void> {
    const id = req.params.id;
    await this.feedService.deletePlaylist(id);
    res.json({ ok: true });
  }

  private async getVideoRecommends(
    req: TypedRequest,
    res: TypedResponse<FeedResponse.GetVideoRecommends>
  ): Promise<void> {
    const id = req.params.id;
    const count = parseInt(req.query.count) || 12;

    if (count > 50) throw new UnprocessableEntityException('???????????? ?????? ???????????????');

    const videos = this.feedService.getVideoRecommends(id, count);
    res.json({
      ok: true,
      videos: videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        is_4k: video.is_4k,
      })),
    });
  }

  private async getUserRecommends(
    req: TypedRequest<UserRecommendsDto>,
    res: TypedResponse<FeedResponse.GetUserRecommends>
  ): Promise<void> {
    const count = parseInt(req.query.count) || 20;

    const data = req.body.data;
    const recommends = this.feedService.getUserRecommends(data, count);
    const videos = recommends[0];
    const emotion = recommends[1];

    res.json({
      ok: true,
      videos: videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        is_4k: video.is_4k,
      })),
      emotion,
    });
  }

  private async getEmotion(
    req: TypedRequest<UserRecommendsDto>,
    res: TypedResponse<FeedResponse.GetEmotion>
  ): Promise<void> {
    const emotion = this.feedService.getEmotionData(req.body.data);
    res.json({ ok: true, emotion });
  }
}

export default FeedController;
