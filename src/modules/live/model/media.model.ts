import { model, Schema } from 'mongoose';
import generateId from '../../../utils/id.util';
import { Media } from '../interface/cinema.interface';

const MediaSchema = new Schema<Media>({
  id: { type: String, required: true, unique: true, default: () => generateId(16) },
  data: { type: Object, required: true },
  action: { type: Object },
  duration: { type: Number, required: true },
  isSequence: { type: Boolean, required: true },
});

MediaSchema.methods.toJSON = function (this: Media): Partial<Media> {
  return { id: this.id, data: this.data, action: this.action, duration: this.duration, isSequence: this.isSequence };
};

const MediaModel = model<Media>('media', MediaSchema);

export default MediaModel;
