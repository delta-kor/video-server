import { model, Schema } from 'mongoose';
import generateId from '../../utils/id.util';
import Ad from './ad.interface';

const AdSchema = new Schema<Ad>({
  id: { type: String, required: true, unique: true, default: () => generateId(8) },
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
});

AdSchema.methods.toJSON = function (this: Ad): Partial<Ad> {
  return { id: this.id, title: this.title, description: this.description, link: this.link };
};

const AdModel = model('ad', AdSchema);

export default AdModel;
