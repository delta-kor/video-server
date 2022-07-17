import { EmotionData } from './store/emotion.store';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  is_4k: boolean;
}

namespace RecommendResponse {
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

export default RecommendResponse;
