import { model, Schema } from 'mongoose';
import GenerateId from '../../../utils/id.util';
import Playlist from '../interface/playlist.interface';

const PlaylistSchema = new Schema<Playlist>({
  id: { type: String, required: true, unique: true, default: () => GenerateId(8) },
  title: { type: String, required: true },
  video: { type: [String], required: true },
  featured: { type: Boolean, required: true },
  order: { type: Number, required: true },
});

const PlaylistModel = model<Playlist>('playlist', PlaylistSchema);

export default PlaylistModel;
