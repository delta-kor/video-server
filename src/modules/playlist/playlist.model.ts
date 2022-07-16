import { model, Schema } from 'mongoose';
import ServiceProvider from '../../services/provider.service';
import generateId from '../../utils/id.util';
import Video from '../video/video.interface';
import VideoService from '../video/video.service';
import Playlist from './playlist.interface';

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

PlaylistSchema.method('serialize', function (this: Playlist, ...keys: (keyof Playlist)[]): Playlist {
  const result: any = {};
  for (const key of keys) {
    if (key === 'video') {
      const videoService: VideoService = ServiceProvider.get(VideoService);

      const videos: Video[] = [];
      for (const videoId of this.video) {
        const video = videoService.get(videoId);
        if (!video) continue;

        const serializedVideo = video.serialize('id', 'type', 'title', 'description', 'duration', 'is_4k');
        videos.push(serializedVideo);
      }

      result.video = videos;
      continue;
    }

    let value: any = this[key];
    if (value instanceof Date) value = value.getTime();

    result[key] = value;
  }

  return result;
});

const PlaylistModel = model<Playlist>('playlist', PlaylistSchema);

export default PlaylistModel;
