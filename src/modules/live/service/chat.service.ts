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

  private readonly chats: Chat[] = [];

  private validateChatContent(content: ChatContent): void {
    switch (content.type) {
      case 'text':
        if (typeof content.text! !== 'string') throw new SocketException();
        if (content.text.length === 0) throw new SocketException('메시지를 입력해주세요');
        if (content.text.length > 50) throw new SocketException('50자 이하로 입력해주세요');
        break;
      case 'emoticon':
        throw new SocketException('존재하지 않는 이모티콘이에요');
        break;
      default:
        throw new SocketException();
    }
  }

  private sendMessage(chat: Chat): void {
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
    this.validateChatContent(content);

    const chat = new ChatModel({ user_id: user.id, content });
    void chat.save();

    this.sendMessage(chat);
  }
}

export default ChatService;
