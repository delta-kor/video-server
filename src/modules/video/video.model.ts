import { Request } from 'express';
import { model, Schema } from 'mongoose';
import ServiceProvider from '../../services/provider.service';
import { getVideoCategory, getVideoDescription, getVideoTitle } from '../../utils/i18n.util';
import generateId from '../../utils/id.util';
import BuilderService from '../builder/builder.service';
import { MusicStore } from '../music/music.store';
import VideoTagStore from './store/tag.store';
import Video, { VideoOptions } from './video.interface';

const VideoSchema = new Schema<Video>({
  id: { type: String, required: true, unique: true, default: () => generateId(6) },
  cdnId: { type: String, required: true },
  cdnId_4k: { type: String, required: false },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: [String], required: true },
  options: { type: [String], required: true },
});

VideoSchema.virtual('duration').get(function (this: Video): number {
  const builderService: BuilderService = ServiceProvider.get(BuilderService);
  return builderService.getVideoDuration(this.id);
});

VideoSchema.virtual('is_4k').get(function (this: Video): boolean {
  return !!this.cdnId_4k;
});

VideoSchema.virtual('tags').get(function (this: Video): string[] {
  const result: string[] = [];
  if (MusicStore.has(this.title)) {
    const tags = VideoTagStore.get(this.title);
    if (tags) result.push(...tags);
  }

  return result;
});

VideoSchema.methods.hasOption = function (this: Video, option: VideoOptions): boolean {
  return this.options.includes(option);
};

VideoSchema.methods.serialize = function (this: Video, req: Request, ...keys: (keyof Video)[]): Video {
  const result: any = {};

  for (const key of keys) {
    let value: any = this[key];

    if (key === 'title') value = getVideoTitle(value, req.i18n.resolvedLanguage);
    if (key === 'description') value = getVideoDescription(value, req.i18n.resolvedLanguage);
    if (key === 'category') value = getVideoCategory(value, req.i18n.resolvedLanguage);

    if (value instanceof Date) value = value.getTime();

    result[key] = value;
  }

  return result;
};

const VideoModel = model<Video>('video', VideoSchema);

export default VideoModel;
