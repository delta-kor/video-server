import Socket from '../../classes/socket.class';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';

class LiveSocket extends Socket {
  protected start(): void {}

  protected onPacket(packet: any): void {
    const type = packet.type;

    switch (type) {
      case 'hello':
        this.onHello(packet);
        break;
      default:
        throw new UnprocessableEntityException('잘못된 요청이에요');
    }
  }

  private onHello(packet: ClientPacket.Hello): void {}
}

export default LiveSocket;
