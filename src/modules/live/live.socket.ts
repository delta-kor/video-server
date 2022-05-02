import Socket from '../../classes/socket.class';
import SocketException from '../../exceptions/socket.exception';

class LiveSocket extends Socket {
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
    packet.ticket;
  }
}

export default LiveSocket;
