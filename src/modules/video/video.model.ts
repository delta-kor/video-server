import { Request } from 'express';
import { model, Schema } from 'mongoose';
import ServiceProvider from '../../services/provider.service';
import generateId from '../../utils/id.util';
import BuilderService from '../builder/builder.service';
import { MusicStore } from '../music/music.store';
import VideoTagStore from './store/tag.store';
import Video, { VideoOption, VideoProperty, Timeline, Teleport, Chapter } from './video.interface';
import UserModel from '../user/user.model';
import LocaleSchema from '../../schemas/locale.schema';
import I18nUtil from '../../utils/i18n.util';

const TeleportSchema = new Schema<Teleport>(
  {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
  },
  { _id: false }
);

const ChapterSchema = new Schema<Chapter>(
  {
    title: { type: LocaleSchema, required: true },
    time: { type: Number, required: true },
  },
  { _id: false }
);

const TimelineSchema = new Schema<Timeline>(
  {
    teleports: { type: [TeleportSchema], required: true },
    chapters: { type: [ChapterSchema], required: true },
  },
  { _id: false }
);

const VideoSchema = new Schema<Video>({
  id: { type: String, required: true, unique: true, default: () => generateId(6) },
  cdnId: { type: String, required: true },
  cdnId_4k: { type: String, required: false },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: [String], required: true },
  subtitle: { type: String, required: false },
  timeline: { type: TimelineSchema, required: false },
  options: { type: [String], required: true },
});

VideoSchema.virtual('duration').get(function (this: Video): number {
  const builderService: BuilderService = ServiceProvider.get(BuilderService);
  return builderService.getVideoDuration(this.id);
});

VideoSchema.virtual('properties').get(function (this: Video): VideoProperty[] {
  const properties: VideoProperty[] = [];
  this.cdnId_4k && properties.push('4k');
  this.subtitle && properties.push('cc');
  return properties;
});

VideoSchema.virtual('tags').get(function (this: Video): string[] {
  const result: string[] = [];
  if (MusicStore.has(this.title)) {
    const tags = VideoTagStore.get(this.title);
    if (tags) result.push(...tags);
  }

  return result;
});

VideoSchema.methods.hasOption = function (this: Video, option: VideoOption): boolean {
  return this.options.includes(option);
};

VideoSchema.methods.getLiked = async function (this: Video): Promise<string[]> {
  const users = await UserModel.find({ liked: this.id });
  return users.map(user => user.id);
};

VideoSchema.methods.serialize = function (this: Video, req: Request, ...keys: (keyof Video)[]): Video {
  const result: any = {};

  for (const key of keys) {
    let value: any = this[key];

    if (key === 'title') value = I18nUtil.getVideoTitle(value, req.i18n.resolvedLanguage);
    if (key === 'description') value = I18nUtil.getVideoDescription(value, req.i18n.resolvedLanguage);
    if (key === 'category') value = I18nUtil.getVideoCategory(value, req.i18n.resolvedLanguage);

    if (value instanceof Date) value = value.getTime();

    result[key] = value;
  }

  return result;
};

const VideoModel = model<Video>('video', VideoSchema);

export default VideoModel;
