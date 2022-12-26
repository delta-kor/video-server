import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import PlaylistService from '../playlist/playlist.service';
import VideoService from '../video/video.service';
import Shipment from './shipment.interface';

class ShipmentService extends Service {
  private readonly playlistService: PlaylistService = ServiceProvider.get(PlaylistService);
  private readonly videoService: VideoService = ServiceProvider.get(VideoService);

  public async get(): Promise<Shipment> {
    const playlists = await this.playlistService.ship();
    const videos = await this.videoService.ship();

    return {
      playlists,
      videos: videos.filter(video => !video.hasOption('fanchant')),
    };
  }
}

export default ShipmentService;
