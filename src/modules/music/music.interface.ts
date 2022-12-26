import Video from '../video/video.interface';

interface Music {
  id: string;
  title: string;
  videos: Video[];
  albumId: string;
}

interface Album {
  id: string;
  title: string;
  count: number;
}

export { Music, Album };
