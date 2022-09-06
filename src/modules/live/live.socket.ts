import Socket from '../../classes/socket.class';
import Constants from '../../constants';
import SocketException from '../../exceptions/socket.exception';
import ServiceProvider from '../../services/provider.service';
import parseTicket from '../../utils/ticket.util';
import User from '../user/user.interface';
import UserService from '../user/user.service';
import { ChatInfo } from './interface/chat.interface';
import { ClientPacket, ServerPacket } from './live.packet';
import ChatService from './service/chat.service';
import CinemaService from './service/cinema.service';

enum SocketState {
  LOITERING,
  ACTIVE,
}

class LiveSocket extends Socket {
  private readonly userService: UserService = ServiceProvider.get(UserService);
  private readonly chatService: ChatService = ServiceProvider.get(ChatService);
  private readonly cinemaService: CinemaService = ServiceProvider.get(CinemaService);

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
          return this.onHelloPacketReceived(packet);
        default:
          throw new SocketException();
      }
    else if (this.state === SocketState.ACTIVE) {
      if (this.user!.isStaff()) {
        switch (type) {
          case 'cue-sync':
            return this.onCueSyncPacketReceived(packet);
          case 'add-media':
            return this.onAddMediaPacketReceived(packet);
        }
      }
      switch (type) {
        case 'user-sync':
          return this.onUserSyncPacketReceived(packet);
        case 'chat-message':
          return this.onChatMessagePacketReceived(packet);
        case 'chat-sync':
          return this.onChatSyncPacketReceived(packet);
        default:
          throw new SocketException('잘못된 Packet Id 이에요');
      }
    }
  }

  private async onHelloPacketReceived(packet: ClientPacket.Hello): Promise<void> {
    const ticket = packet.ticket;
    const token = packet.token;

    const user = await this.userService.getUserByToken(token, true);

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
      last: infos.length !== Constants.CHAT_SPLIT_COUNT,
    };
    this.sendPacket(response);
  }

  private async onCueSyncPacketReceived(packet: ClientPacket.Manage.CueSync): Promise<void> {
    this.cinemaService.sendCueSyncPacket(this, packet.packet_id);
  }

  private async onAddMediaPacketReceived(packet: ClientPacket.Manage.AddMedia): Promise<void> {
    const data = packet.media;
    await this.cinemaService.addMedia(data);
  }
}

export { SocketState };
export default LiveSocket;
