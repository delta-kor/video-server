import Video from '../video/video.interface';

interface Folder {
  id: string;
  path: string[];
  title: string;
  count: number;
  children: number;
  date: number;
}

interface Path {
  id: string;
  title: string;
  count: number;
  children: number;
}

namespace CategoryResponse {
  interface ViewFolder extends ApiResponse {
    type: 'folder';
    path: Path[];
    data: Omit<Folder, 'path'>[];
  }

  interface ViewFile extends ApiResponse {
    type: 'file';
    path: Path[];
    data: Video[];
  }

  export type View = ViewFolder | ViewFile;
}

export { Folder, Path };
export default CategoryResponse;
