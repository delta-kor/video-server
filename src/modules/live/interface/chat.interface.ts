import { Document } from 'mongoose';

interface Chat extends Document {
  id: string;
  date: Date;
  content: ChatContent;
  deleted: boolean;
}

type ChatContent = TextContent | EmoticonContent;

interface TextContent {
  type: 'text';
  user_id: string;
  content: string;
}

interface EmoticonContent {
  type: 'emoticon';
  user_id: string;
  key: string;
}

export default Chat;
