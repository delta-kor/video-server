import Playlist from '../playlist/interface/playlist.interface';
import Video from '../video/video.interface';

interface Shipment {
  playlists: Playlist[];
  videos: Video[];
}

export default Shipment;
