import { model, Schema } from 'mongoose';
import Env from './env.interface';

const EnvSchema = new Schema<Env>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
});

const EnvModel = model<Env>('env', EnvSchema);

export default EnvModel;
