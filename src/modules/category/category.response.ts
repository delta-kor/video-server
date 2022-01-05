interface Folder {
  title: string;
  hash: string;
  count: number;
}

interface File {
  id: string;
  title: string;
  date: number;
}

namespace CategoryResponse {
  export interface Parent extends ApiResponse {
    type: 'parent';
    folders: Folder[];
  }

  export interface Children extends ApiResponse {
    type: 'children';
    files: File[];
  }
}

export default CategoryResponse;
