import { Path } from '../category/category.response';

interface ShortVideoInfo {
  id: string;
  title: string;
  description: string;
  duration: number;
}

namespace VideoResponse {
  export interface Upload extends ApiResponse {
    id: string;
  }

  export interface Stream extends ApiResponse {
    url: string;
    duration: number;
    quality: number;
    qualities: number[];
  }

  export interface Info extends ApiResponse {
    id: string;
    title: string;
    description: string;
    duration: number;
    date: number;
    path: Path[];
    liked: boolean;
    likes_total: number;
  }

  export interface List extends ApiResponse {
    data: ShortVideoInfo[];
  }

  export interface Like extends ApiResponse {
    liked: boolean;
    total: number;
  }
}

export { ShortVideoInfo };
export default VideoResponse;
