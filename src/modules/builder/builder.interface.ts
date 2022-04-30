interface FileItem {
  id: string;
  duration: number;
  select: number;
}

interface RadioFileItem {
  id: string;
  title: string;
  album: string;
  duration: number;
}

export { FileItem, RadioFileItem };
