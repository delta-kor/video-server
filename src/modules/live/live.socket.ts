import Socket from '../../classes/socket.class';
import SocketException from '../../exceptions/socket.exception';
import ServiceProvider from '../../services/provider.service';
import parseTicket from '../../utils/ticket.util';
import User from './interface/user.interface';
import { ClientPacket, ServerPacket } from './live.packet';
import LiveService from './service/live.service';

enum SocketState {
  LOITERING,
  ACTIVE,
}

class LiveSocket extends Socket {
  private readonly liveService: LiveService = ServiceProvider.get(LiveService);

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

    switch (type) {
      case 'hello':
        await this.onHello(packet);
        break;
      default:
        throw new SocketException();
    }
  }

  private async onHello(packet: ClientPacket.Hello): Promise<void> {
    const ticket = packet.ticket;
    const token = packet.token;

    const user = await this.liveService.getUser(token);

    this.ip = parseTicket(ticket);
    this.state = SocketState.ACTIVE;
    this.user = user;
    this.emit('hello');

    user.addIp(this.ip);
    const newToken = user.createToken();

    const response: ServerPacket.Hello = {
      type: 'hello',
      packet_id: packet.packet_id,
      server_time: Date.now(),
      user_info: user.info(),
      token: newToken,
    };
    this.sendPacket(response);
  }

  public onMultipleConnect(): void {
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
