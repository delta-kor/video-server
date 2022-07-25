import Video from '../video/video.interface';
import Playlist from './playlist.interface';

namespace PlaylistResponse {
  export interface Create extends ApiResponse {
    id: string;
  }

  export interface Read extends ApiResponse {
    playlist: Playlist;
  }

  export interface ReadAll extends ApiResponse {
    playlists: Playlist[];
  }

  export interface ReadFeatured extends ApiResponse {
    playlist_id: string;
    video: Video;
  }

  export interface Update extends ApiResponse {
    playlist: Playlist;
  }
}

export default PlaylistResponse;
