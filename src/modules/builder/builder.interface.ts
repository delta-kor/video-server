import { Lyrics } from '../radio/radio.interface';

interface FileItem {
  id: string;
  duration: number;
  select: number;
}

interface RadioFileItem {
  id: string;
  fileName: string;
  title: string;
  album: string;
  duration: number;
  lyrics?: Lyrics;
}

export { FileItem, RadioFileItem };
