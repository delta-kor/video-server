interface Folder {
  title: string;
  path: string;
  count: number;
}

interface File {
  id: string;
  title: string;
  date: number;
  duration: number;
}

namespace CategoryResponse {
  export interface Parent extends ApiResponse {
    type: 'parent';
    path: string[];
    folders: Folder[];
  }

  export interface Children extends ApiResponse {
    type: 'children';
    path: string[];
    files: File[];
  }
}

export default CategoryResponse;
