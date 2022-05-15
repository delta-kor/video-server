import Socket from '../../classes/socket.class';
import SocketException from '../../exceptions/socket.exception';
import ServiceProvider from '../../services/provider.service';
import parseTicket from '../../utils/ticket.util';
import User from './interface/user.interface';
import { ClientPacket, ServerPacket } from './live.packet';
import UserService from './service/user.service';

enum SocketState {
  LOITERING,
  ACTIVE,
}

class LiveSocket extends Socket {
  private readonly userService: UserService = ServiceProvider.get(UserService);

  public state: SocketState = SocketState.LOITERING;
  public ip: string | null = null;
  public user: User | null = null;

  protected start(): void {}

  private softClose(): void {
    this.state = SocketState.LOITERING;
    this.ip = null;
    this.user = null;
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

    if (this.state === SocketState.ACTIVE)
      switch (type) {
        case 'user-sync':
          await this.onUserSyncPacketReceived(packet);
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

  public onMultipleConnection(): void {
    const packet: ServerPacket.MultipleConnect = {
      type: 'multiple-connect',
      packet_id: null,
    };
    this.sendPacket(packet);
    this.softClose();
  }
}

export { SocketState };
export default LiveSocket;
