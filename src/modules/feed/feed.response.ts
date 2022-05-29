import { EmotionData } from './store/emotion.store';

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
  is_4k: boolean;
}

namespace FeedResponse {
  export interface UploadPlaylist extends ApiResponse {
    id: string;
  }

  export interface GetAllPlaylists extends ApiResponse {
    playlists: PlaylistItem[];
  }

  export interface GetOnePlaylist extends PlaylistItem, ApiResponse {}

  export interface GetVideoRecommends extends ApiResponse {
    videos: VideoItem[];
  }

  export interface GetUserRecommends extends ApiResponse {
    videos: VideoItem[];
    emotion: EmotionData;
  }
}

export default FeedResponse;
