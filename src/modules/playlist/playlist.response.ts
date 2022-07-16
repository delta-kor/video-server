import Video from '../video/video.interface';
import Playlist from './playlist.interface';

namespace PlaylistResponse {
  export interface CreatePlaylist extends ApiResponse {
    id: string;
  }

  export interface ReadPlaylist extends ApiResponse {
    playlist: Playlist;
  }

  export interface ReadAllPlaylists extends ApiResponse {
    playlists: Playlist[];
  }

  export interface ReadFeatured extends ApiResponse {
    playlist_id: string;
    video: Video;
  }

  export interface UpdatePlaylist extends ApiResponse {
    playlist: Playlist;
  }
}

export default PlaylistResponse;
