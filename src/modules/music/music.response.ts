import { Album, Music } from './music.interface';

namespace MusicResponse {
  export interface GetAllAlbums extends ApiResponse {
    albums: Album[];
  }

  export interface GetOneAlbum extends ApiResponse {
    album: Album;
    musics: Music[];
  }

  export interface GetOneMusic extends ApiResponse {
    music: Music;
  }
}

export default MusicResponse;
