import { Document } from 'mongoose';

interface Ad extends Document {
  id: string;
  title: string;
  description: string;
  link: string;
}

export default Ad;
