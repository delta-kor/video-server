import Video from '../video/video.interface';

interface Music {
  title: string;
  hash: string;
  videos: Video[];
}

interface Album {
  id: string;
  title: string;
  count: number;
}

export { Music, Album };
