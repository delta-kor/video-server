import { WebSocket } from 'ws';
import Constants from '../constants';
import HttpException from '../exceptions/http.exception';

abstract class Socket {
  protected readonly socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;
    this.socket.on('message', this.onMessage);
    this.start();
  }

  protected abstract start(): void;
  protected abstract onPacket(packet: ClientPacketBase): void;

  protected sendPacket(packet: ServerPacketBase): void {
    this.sendJson(packet);
  }

  protected sendError(message: string, packetId: number | null = null): void {
    const packet: ServerPacket.Error = {
      type: 'error',
      packet_id: packetId,
      message,
    };
    this.sendPacket(packet);
  }

  private onMessage = (json: string): void => {
    try {
      const data: ClientPacketBase = JSON.parse(json);
      this.onPacket(data);
    } catch (e) {
      if (e instanceof HttpException) {
        const data: ClientPacketBase = JSON.parse(json);
        this.sendError(e.message, data.packet_id);
      } else this.sendError(Constants.WRONG_REQUEST);
    }
  };

  private sendJson(data: any): void {
    const json = JSON.stringify(data);
    this.socket.send(json);
  }
}

export default Socket;
