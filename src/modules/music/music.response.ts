interface MusicItem {
  id: string;
  title: string;
  count: number;
}

namespace MusicResponse {
  export interface ViewAll extends ApiResponse {
    musics: MusicItem[];
  }
}

export { MusicItem };
export default MusicResponse;
