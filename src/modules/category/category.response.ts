interface Folder {
  title: string;
  path: string;
  count: number;
  children: number;
}

interface File {
  id: string;
  title: string;
  date: number;
  duration: number;
  is_4k: boolean;
}

interface Path {
  name: string;
  path: string;
  count: number;
}

namespace CategoryResponse {
  export interface Parent extends ApiResponse {
    type: 'parent';
    path: Path[];
    folders: Folder[];
  }

  export interface Children extends ApiResponse {
    type: 'children';
    path: Path[];
    files: File[];
  }
}

export default CategoryResponse;
export { Path };
