import { WebSocket, WebSocketServer } from 'ws';

class Gateway {
  protected readonly server: WebSocketServer;

  constructor(server: WebSocketServer) {
    this.server = server;
  }

  public load() {
    this.server.on('listening', this.onListening);
    this.server.on('connection', this.onConnection);
    this.server.on('error', this.onError);
  }

  protected onListening(): void {}
  protected onConnection(socket: WebSocket): void {}
  protected onError(): void {}
}

export default Gateway;
