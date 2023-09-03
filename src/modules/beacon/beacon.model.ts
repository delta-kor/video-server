import { Schema, model } from 'mongoose';
import Beacon from './beacon.interface';
import generateId from '../../utils/id.util';

const BeaconSchema = new Schema<Beacon>({
  id: { type: String, required: true, unique: true, default: () => generateId(16) },
  time: { type: Date, required: true, default: () => new Date() },
  ip: { type: String, required: false },
  videoId: { type: String, required: true },
  userId: { type: String, required: true },
  playedTime: { type: Number, required: true },
});

const BeaconModel = model<Beacon>('beacon', BeaconSchema);

export default BeaconModel;
