import EventEmitter from 'events';
import { WebSocket } from 'ws';
import Constants from '../constants';
import HttpException from '../exceptions/http.exception';
import { ClientPacketBase, ServerPacket, ServerPacketBase } from '../modules/live/live.packet';

abstract class Socket extends EventEmitter {
  protected readonly socket: WebSocket;

  constructor(socket: WebSocket) {
    super();
    this.socket = socket;
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.on('close', () => this.emit('close'));
    this.start();
  }

  protected close(): void {
    this.socket.close();
  }

  protected abstract start(): void;
  protected abstract onPacket(packet: ClientPacketBase): Promise<void>;

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

  private async onMessage(json: string): Promise<void> {
    try {
      const data: ClientPacketBase = JSON.parse(json);
      await this.onPacket(data);
    } catch (e) {
      if (e instanceof HttpException) {
        const data: ClientPacketBase = JSON.parse(json);
        this.sendError(e.message, data.packet_id);
      } else {
        this.sendError(Constants.WRONG_REQUEST);
        console.error(e);
      }
    }
  }

  private sendJson(data: any): void {
    const json = JSON.stringify(data);
    this.socket.send(json);
  }
}

export default Socket;
