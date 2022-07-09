import { model, Schema } from 'mongoose';
import generateId from '../../../utils/id.util';
import Playlist from '../interface/playlist.interface';

const PlaylistSchema = new Schema<Playlist>({
  id: { type: String, required: true, unique: true, default: () => generateId(8) },
  label: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  video: { type: [String], required: true },
  featured: { type: Boolean, required: true },
  order: { type: Number, required: true },
});

const PlaylistModel = model<Playlist>('playlist', PlaylistSchema);

export default PlaylistModel;
