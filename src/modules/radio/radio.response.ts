import { Lyrics } from './radio.interface';

namespace RadioResponse {
  export interface Stream extends ApiResponse {
    title: string;
    album: string;
    duration: number;
    lyrics: Lyrics | null;
    url: string;
  }
}

export default RadioResponse;
