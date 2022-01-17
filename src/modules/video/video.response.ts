import { Path } from '../category/category.response';

namespace VideoResponse {
  export interface Upload extends ApiResponse {
    id: string;
  }

  export interface Stream extends ApiResponse {
    url: string;
    duration: number;
    qualities: number[];
  }

  export interface Info extends ApiResponse {
    title: string;
    description: string;
    duration: number;
    date: number;
    path: Path[];
  }
}

export default VideoResponse;
