import { Document } from 'mongoose';

interface Playlist extends Document {
  id: string;
  title: string;
  video: string[];
  featured: boolean;
}

export default Playlist;
