import Video from '../video/video.interface';

namespace SearchResponse {
  export interface Search extends ApiResponse {
    videos: Video[];
  }
}

export default SearchResponse;
