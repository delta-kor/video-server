import Video from '../video/video.interface';
import { EmotionData } from './store/emotion.store';

namespace RecommendResponse {
  export interface GetVideoRecommends extends ApiResponse {
    videos: Video[];
  }

  export interface GetUserRecommends extends ApiResponse {
    videos: Video[];
  }

  export interface GetEmotion extends ApiResponse {
    emotion: EmotionData;
  }
}

export default RecommendResponse;
