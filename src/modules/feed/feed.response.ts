interface PlaylistItem {
  id: string;
  title: string;
  videos: VideoItem[];
  featured: boolean;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: number;
}

namespace FeedResponse {
  export interface UploadPlaylist extends ApiResponse {
    id: string;
  }

  export interface GetAllPlaylists extends ApiResponse {
    playlists: PlaylistItem[];
  }

  export interface GetOnePlaylist extends PlaylistItem, ApiResponse {}

  export interface GetRecommends extends ApiResponse {
    videos: VideoItem[];
  }
}

export default FeedResponse;
