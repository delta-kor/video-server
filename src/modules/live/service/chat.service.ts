import Constants from '../../../constants';
import SocketException from '../../../exceptions/socket.exception';
import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import Chat, { ChatContent, ChatInfo } from '../interface/chat.interface';
import User from '../interface/user.interface';
import { ServerPacket } from '../live.packet';
import ChatModel from '../model/chat.model';
import SocketService from './socket.service';

class ChatService extends Service {
  private readonly socketService: SocketService = ServiceProvider.get(SocketService);

  private readonly chats: Map<string, Chat> = new Map();
  private lastChat: Chat | null = null;

  public async load(): Promise<void> {
    const chats: Chat[] = await ChatModel.find({ deleted: false }).sort({ date: -1 }).limit(Constants.CHAT_SPLIT_COUNT);
    chats.forEach(chat => this.chats.set(chat.id, chat));

    const last = await ChatModel.find({ deleted: false }).sort({ date: 1 }).limit(1);
    this.lastChat = last[0];
  }

  private getChatFromCache(id: string): Chat | null {
    for (const chat of this.chats.values()) if (chat.id === id) return chat;
    return null;
  }

  private getChatsFromPoint(point: string | null): Chat[] {
    if (!point) {
      const sorted = Array.from(this.chats.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
      return sorted.slice(0, Constants.CHAT_SPLIT_COUNT);
    }

    const pointChat = this.chats.get(point);
    if (!pointChat) throw new SocketException();

    const sorted = Array.from(this.chats.values()).sort((a, b) => b.date.getTime() - a.date.getTime());
    const pointIndex = sorted.indexOf(pointChat);

    const result = sorted.slice(pointIndex + 1, pointIndex + 1 + Constants.CHAT_SPLIT_COUNT);
    return result.reverse();
  }

  private sanitizeChatContent(content: ChatContent): ChatContent {
    switch (content.type) {
      case 'text':
        if (typeof content.text! !== 'string') throw new SocketException();
        if (content.text.length === 0) throw new SocketException('메시지를 입력해주세요');
        if (content.text.length > 50) throw new SocketException('50자 이하로 입력해주세요');
        return { type: 'text', text: content.text };
      case 'emoticon':
        throw new SocketException('존재하지 않는 이모티콘이에요');
      default:
        throw new SocketException();
    }
  }

  private sendMessage(chat: Chat): void {
    void chat.save();
    this.chats.set(chat.id, chat);

    const chatInfo: ChatInfo = {
      id: chat.id,
      user_id: chat.user_id,
      content: chat.content,
    };

    const packet: ServerPacket.ChatMessage = {
      type: 'chat-message',
      packet_id: null,
      chat_info: chatInfo,
    };

    this.socketService.sendToAllActiveSockets(packet);
  }

  public onMessageSent(content: ChatContent, user: User): void {
    content = this.sanitizeChatContent(content);

    const chat = new ChatModel({ user_id: user.id, content });
    this.sendMessage(chat);
  }

  public async getChats(point: string | null): Promise<Chat[]> {
    if (point) {
      const pointChat = this.getChatFromCache(point);
      if (
        !pointChat ||
        (this.getChatsFromPoint(point).length < Constants.CHAT_SPLIT_COUNT && !this.chats.has(this.lastChat!.id))
      ) {
        const chat: Chat | null = await ChatModel.findOne({ id: point });
        if (!chat) throw new SocketException();

        const freshChats: Chat[] = await ChatModel.find({ date: { $gte: chat.date }, deleted: false });
        const oldChats: Chat[] = await ChatModel.find({ date: { $lt: chat.date }, deleted: false })
          .sort({ date: -1 })
          .limit(Constants.CHAT_SPLIT_COUNT);
        [...freshChats, ...oldChats].forEach(chat => this.chats.set(chat.id, chat));
      }
    }
    return this.getChatsFromPoint(point);
  }
}

export default ChatService;
