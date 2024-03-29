import Video from '../video/video.interface';
import Playlist from './interface/playlist.interface';

namespace PlaylistResponse {
  export interface Create extends ApiResponse {
    id: string;
  }

  export interface Read extends ApiResponse {
    playlist: Playlist;
    access: boolean;
  }

  export interface ReadAll extends ApiResponse {
    playlists: Playlist[];
  }

  export interface ReadFeatured extends ApiResponse {
    playlist_id: string;
    video: Video;
    url: string;
  }

  export interface Update extends ApiResponse {
    playlist: Playlist;
  }

  export interface CreateUserPlaylist extends ApiResponse {
    id: string;
  }

  export interface UpdateUserPlaylist extends ApiResponse {
    playlist: Playlist;
  }
}

export default PlaylistResponse;
