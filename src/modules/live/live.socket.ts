import Socket from '../../classes/socket.class';
import SocketException from '../../exceptions/socket.exception';
import parseTicket from '../../utils/ticket.util';

enum SocketState {
  LOITERING,
  READY,
}

class LiveSocket extends Socket {
  public state: SocketState = SocketState.LOITERING;
  public ip: string | null = null;

  protected start(): void {}

  protected onPacket(packet: any): void {
    const type = packet.type;

    switch (type) {
      case 'hello':
        this.onHello(packet);
        break;
      default:
        throw new SocketException();
    }
  }

  private onHello(packet: ClientPacket.Hello): void {
    const ticket = packet.ticket;

    this.ip = parseTicket(ticket);
    this.state = SocketState.READY;

    const response: ServerPacket.Hello = {
      type: 'hello',
      packet_id: packet.packet_id,
      server_time: Date.now(),
    };
    this.sendPacket(response);
  }
}

export { SocketState };
export default LiveSocket;
