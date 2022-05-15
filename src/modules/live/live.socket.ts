import Socket from '../../classes/socket.class';
import SocketException from '../../exceptions/socket.exception';
import ServiceProvider from '../../services/provider.service';
import parseTicket from '../../utils/ticket.util';
import { ChatInfo } from './interface/chat.interface';
import User from './interface/user.interface';
import { ClientPacket, ServerPacket } from './live.packet';
import ChatService from './service/chat.service';
import UserService from './service/user.service';

enum SocketState {
  LOITERING,
  ACTIVE,
}

class LiveSocket extends Socket {
  private readonly userService: UserService = ServiceProvider.get(UserService);
  private readonly chatService: ChatService = ServiceProvider.get(ChatService);

  public state: SocketState = SocketState.LOITERING;
  public ip: string | null = null;
  public user: User | null = null;

  protected start(): void {}

  private softClose(): void {
    this.state = SocketState.LOITERING;
    this.ip = null;
    this.user = null;
  }

  public onMultipleConnection(): void {
    const packet: ServerPacket.MultipleConnect = {
      type: 'multiple-connect',
      packet_id: null,
    };
    this.sendPacket(packet);
    this.softClose();
  }

  protected async onPacket(packet: any): Promise<void> {
    const type = packet.type;

    if (this.state === SocketState.LOITERING)
      switch (type) {
        case 'hello':
          await this.onHelloPacketReceived(packet);
          break;
        default:
          throw new SocketException();
      }
    else if (this.state === SocketState.ACTIVE)
      switch (type) {
        case 'user-sync':
          await this.onUserSyncPacketReceived(packet);
          break;
        case 'chat-message':
          await this.onChatMessagePacketReceived(packet);
          break;
        case 'chat-sync':
          await this.onChatSyncPacketReceived(packet);
          break;
        default:
          throw new SocketException();
      }
  }

  private async onHelloPacketReceived(packet: ClientPacket.Hello): Promise<void> {
    const ticket = packet.ticket;
    const token = packet.token;

    const user = await this.userService.getUserByToken(token);

    this.ip = parseTicket(ticket);
    this.state = SocketState.ACTIVE;
    this.user = user;
    this.user.addIp(this.ip);

    const response: ServerPacket.Hello = {
      type: 'hello',
      packet_id: packet.packet_id,
      server_time: Date.now(),
      user_info: user.info(),
      token: user.createToken(),
    };
    this.sendPacket(response);

    this.emit('hello');
  }

  private async onUserSyncPacketReceived(packet: ClientPacket.UserSync): Promise<void> {
    const target = packet.id;

    const users = await this.userService.getAllUsersById(target);
    const userInfos = users.map(user => user.info());

    const response: ServerPacket.UserSync = {
      type: 'user-sync',
      packet_id: packet.packet_id,
      data: userInfos,
    };
    this.sendPacket(response);
  }

  private async onChatMessagePacketReceived(packet: ClientPacket.ChatMessage): Promise<void> {
    this.chatService.onMessageSent(packet.content, this.user!);
  }

  private async onChatSyncPacketReceived(packet: ClientPacket.ChatSync): Promise<void> {
    const point = packet.point;
    const chats = await this.chatService.getChats(point);

    const infos: ChatInfo[] = chats.map(chat => ({ id: chat.id, user_id: chat.user_id, content: chat.content }));

    const response: ServerPacket.ChatSync = {
      type: 'chat-sync',
      packet_id: packet.packet_id,
      data: infos,
    };
    this.sendPacket(response);
  }
}

export { SocketState };
export default LiveSocket;
