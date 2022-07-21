import { model, Schema } from 'mongoose';
import NotFoundException from '../../exceptions/not-found.exception';
import ServiceProvider from '../../services/provider.service';
import generateId from '../../utils/id.util';
import BuilderService from '../builder/builder.service';
import Video, { VideoOptions } from './video.interface';
import VideoService from './video.service';

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

VideoSchema.methods.hasOption = function (this: Video, option: VideoOptions): boolean {
  return this.options.includes(option);
};

VideoSchema.methods.serialize = function (this: Video, ...keys: (keyof Video)[]): Video {
  const result: any = {};
  for (const key of keys) {
    let value: any = this[key];
    if (value instanceof Date) value = value.getTime();

    result[key] = value;
  }

  return result;
};

VideoSchema.methods.restore = function (this: Video): Video {
  const id = this.id;

  const videoService: VideoService = ServiceProvider.get(VideoService);
  const video = videoService.get(id);

  if (!video) throw new NotFoundException();
  return video;
};

const VideoModel = model<Video>('video', VideoSchema);

export default VideoModel;
