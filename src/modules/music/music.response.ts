import { Album, Music } from './music.interface';

namespace MusicResponse {
  export interface GetAllAlbums extends ApiResponse {
    albums: Album[];
  }

  export interface GetOneAlbum extends ApiResponse {
    album: Album;
    musics: Music[];
  }
}

export default MusicResponse;
