import { Document } from 'mongoose';

interface Playlist extends Document {
  id: string;
  title: string;
  video: string[];
}

export default Playlist;
