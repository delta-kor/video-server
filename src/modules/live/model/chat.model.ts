import { model, Schema } from 'mongoose';
import generateId from '../../../utils/id.util';
import Chat from '../interface/chat.interface';

const ChatSchema = new Schema<Chat>({
  id: { type: String, required: true, unique: true, default: () => generateId(8) },
  date: { type: Date, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  deleted: { type: Boolean, required: true, default: () => false },
});

const ChatModel = model<Chat>('chat', ChatSchema);

export default ChatModel;
