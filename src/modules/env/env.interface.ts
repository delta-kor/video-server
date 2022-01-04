import { Document } from 'mongoose';

interface Env extends Document {
  key: string;
  value: any;
}

export default Env;
