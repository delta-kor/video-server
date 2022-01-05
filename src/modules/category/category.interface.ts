interface ParentCategory {
  name: string;
  hash: string;
  children: Map<string, ChildCategory | ParentCategory>;
}

interface ChildCategory {
  name: string;
  hash: string;
  videos: string[];
}

export { ParentCategory, ChildCategory };
