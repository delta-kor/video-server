import WebSocket from 'ws';
import Gateway from '../../classes/gateway.class';
import ServiceProvider from '../../services/provider.service';
import LiveSocket from './live.socket';
import LiveService from './service/live.service';

class LiveGateway extends Gateway {
  private readonly liveService: LiveService = ServiceProvider.get(LiveService);

  protected onListening(): void {
    console.log('Gateway listening');
  }

  protected onConnection(webSocket: WebSocket): void {
    const socket = new LiveSocket(webSocket);
    this.liveService.onConnect(socket);
    socket.on('close', () => this.liveService.onDisconnect(socket));
    socket.on('hello', () => this.liveService.onHello(socket));
  }
}

export default LiveGateway;
