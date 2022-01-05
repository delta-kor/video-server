import Video from '../video/video.interface';

interface ParentCategory {
  name: string;
  hash: string;
  children: Map<string, ChildCategory | ParentCategory>;
}

interface ChildCategory {
  name: string;
  hash: string;
  videos: Video[];
}

export { ParentCategory, ChildCategory };
