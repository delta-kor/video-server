import { Path } from '../category/category.response';
import { Timeline, VideoProperty } from './video.interface';

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
    properties: VideoProperty[];
    music: [string, string] | null;
    timeline?: Timeline;
    members?: string[];
  }

  export interface List extends ApiResponse {
    data: ShortVideoInfo[];
  }

  export interface Action extends ApiResponse {
    liked: boolean;
    likes_total: number;
  }

  export interface Like extends ApiResponse {
    liked: boolean;
    total: number;
  }
}

export { ShortVideoInfo };
export default VideoResponse;
