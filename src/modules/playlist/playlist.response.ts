import Playlist from './playlist.interface';

namespace PlaylistResponse {
  export interface CreatePlaylist extends ApiResponse {
    id: string;
  }

  export interface ReadPlaylist extends ApiResponse {
    playlist: Playlist;
  }

  export interface UpdatePlaylist extends ApiResponse {
    playlist: Playlist;
  }
}

export default PlaylistResponse;
