interface PlaylistItem {
  id: string;
  title: string;
  videos: string[];
  featured: boolean;
}

namespace FeedResponse {
  export interface UploadPlaylist extends ApiResponse {
    id: string;
  }

  export interface GetAllPlaylists extends ApiResponse {
    playlists: PlaylistItem[];
  }

  export interface GetOnePlaylist extends PlaylistItem, ApiResponse {}
}

export default FeedResponse;
