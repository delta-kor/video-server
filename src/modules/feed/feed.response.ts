import Playlist from './interface/playlist.interface';
import { EmotionData } from './store/emotion.store';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  is_4k: boolean;
}

namespace FeedResponse {
  export interface CreatePlaylist extends ApiResponse {
    id: string;
  }

  export interface UpdatePlaylist extends ApiResponse {
    playlist: Playlist;
  }

  export interface GetVideoRecommends extends ApiResponse {
    videos: VideoItem[];
  }

  export interface GetUserRecommends extends ApiResponse {
    videos: VideoItem[];
    emotion: EmotionData;
  }

  export interface GetEmotion extends ApiResponse {
    emotion: EmotionData;
  }
}

export default FeedResponse;
