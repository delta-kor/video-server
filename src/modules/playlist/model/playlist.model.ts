import { Request } from 'express';
import { model, Schema } from 'mongoose';
import ServiceProvider from '../../../services/provider.service';
import generateId from '../../../utils/id.util';
import Video from '../../video/video.interface';
import VideoService from '../../video/video.service';
import Playlist, { PlaylistModel } from '../interface/playlist.interface';
import I18nUtil from '../../../utils/i18n.util';

const PlaylistSchema = new Schema<Playlist>({
  id: { type: String, required: true, unique: true, default: () => generateId(8) },
  label: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: Object, required: true },
  description: { type: Object, required: true },
  video: { type: [String], required: true },
  featured: { type: Boolean, required: true },
  order: { type: Number, required: true },
  image: { type: String, required: false },
  cluster: { type: Object, required: false },
});

PlaylistSchema.statics.createLikedPlaylist = function (videos: Video[]): Playlist {
  return new PlaylistModel({
    id: 'liked',
    label: 'liked',
    type: 'performance',
    title: { ko: '좋아요 표시한 동영상', en: 'Liked videos' },
    description: { ko: '좋아요 표시한 동영상', en: 'Liked videos' },
    video: videos.map(video => video.id),
    featured: false,
    order: 0,
  });
};

PlaylistSchema.virtual('thumbnail').get(function (this: Playlist): string {
  return this.image || this.video[0];
});

PlaylistSchema.virtual('count').get(function (this: Playlist): number {
  return this.video.length;
});

PlaylistSchema.methods.serialize = function (this: Playlist, req: Request, ...keys: (keyof Playlist)[]): Playlist {
  const result: any = {};
  for (const key of keys) {
    if (key === 'video') {
      const videoService: VideoService = ServiceProvider.get(VideoService);

      const videos: Video[] = [];
      for (const videoId of this.video) {
        const video = videoService.get(videoId);
        if (!video) continue;

        const serializedVideo = video.serialize(req, 'id', 'title', 'description', 'duration', 'properties');
        videos.push(serializedVideo);
      }

      result.video = videos;
      continue;
    }

    if (key === 'title' || key === 'description' || key === 'cluster') {
      const target = this[key];
      if (target) {
        result[key] = I18nUtil.getLocaleString(target, req.i18n.resolvedLanguage);
        continue;
      }
    }

    let value: any = this[key];
    if (value instanceof Date) value = value.getTime();

    result[key] = value;
  }

  return result;
};

const PlaylistModel = model<Playlist, PlaylistModel>('playlist', PlaylistSchema);

export default PlaylistModel;
