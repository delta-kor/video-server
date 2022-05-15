import { Document } from 'mongoose';

interface ChatInfo {
  id: string;
  user_id: string | null;
  content: ChatContent;
}

interface Chat extends Document {
  id: string;
  date: Date;
  user_id: string | null;
  content: ChatContent;
  deleted: boolean;
}

type ChatContent = TextContent | EmoticonContent;

interface TextContent {
  type: 'text';
  text: string;
}

interface EmoticonContent {
  type: 'emoticon';
  key: string;
}

export { ChatInfo, ChatContent };
export default Chat;
