import Socket from '../../classes/socket.class';
import SocketException from '../../exceptions/socket.exception';
import ServiceProvider from '../../services/provider.service';
import parseTicket from '../../utils/ticket.util';
import { UserInfo } from './interface/user.interface';
import { ClientPacket, ServerPacket } from './live.packet';
import LiveService from './service/live.service';

enum SocketState {
  LOITERING,
  READY,
}

class LiveSocket extends Socket {
  private readonly liveService: LiveService = ServiceProvider.get(LiveService);

  public state: SocketState = SocketState.LOITERING;
  public ip: string | null = null;

  protected start(): void {}

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

    this.ip = parseTicket(ticket);
    this.state = SocketState.READY;

    const user = await this.liveService.getUser(token);
    const info: UserInfo = { id: user.id, nickname: user.nickname, role: user.role };

    user.addIp(this.ip);

    const response: ServerPacket.Hello = {
      type: 'hello',
      packet_id: packet.packet_id,
      server_time: Date.now(),
      user_info: info,
    };
    this.sendPacket(response);
  }
}

export { SocketState };
export default LiveSocket;
