import { model, Schema } from 'mongoose';
import ServiceProvider from '../../services/provider.service';
import generateId from '../../utils/id.util';
import BuilderService from '../builder/builder.service';
import Video from './video.interface';

const VideoSchema = new Schema<Video>({
  id: { type: String, required: true, unique: true, default: () => generateId(6) },
  cdnId: { type: String, required: true },
  cdnId_4k: { type: String, required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: [String], required: true },
  private: { type: Boolean, required: true },
});

VideoSchema.virtual('duration').get(function (this: Video): number {
  const builderService: BuilderService = ServiceProvider.get(BuilderService);
  return builderService.getVideoDuration(this.id);
});

VideoSchema.virtual('is_4k').get(function (this: Video): boolean {
  return !!this.cdnId_4k;
});

const VideoModel = model<Video>('video', VideoSchema);

export default VideoModel;
