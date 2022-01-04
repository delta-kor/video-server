import { Mixed, model, Schema } from 'mongoose';
import Env from './env.interface';

const EnvSchema = new Schema<Env>({
  key: { type: String, required: true, unique: true },
  value: { type: Mixed, required: true },
});

const EnvModel = model('env', EnvSchema);

export default EnvModel;
