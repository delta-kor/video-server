interface MusicItem {
  id: string;
  title: string;
  count: number;
}

interface VideoItem {
  id: string;
  description: string;
  date: number;
  duration: number;
  is_4k: boolean;
}

namespace MusicResponse {
  export interface ViewAll extends ApiResponse {
    musics: MusicItem[];
  }

  export interface ViewOne extends ApiResponse {
    videos: VideoItem[];
  }
}

export { MusicItem, VideoItem };
export default MusicResponse;
