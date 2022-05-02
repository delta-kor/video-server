import { WebSocket } from 'ws';

abstract class Socket {
  protected readonly socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;
    this.start();
  }

  protected abstract start(): void;

  protected sendJson(data: any): void {
    const json = JSON.stringify(data);
    this.socket.send(json);
  }
}

export default Socket;
