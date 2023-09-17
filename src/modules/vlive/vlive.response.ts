import Video from '../video/video.interface';

interface VliveFilter {
  anchor: string;
}

namespace VliveResponse {
  export interface List extends ApiResponse {
    videos: Video[];
  }
}

export { VliveFilter };
export default VliveResponse;
