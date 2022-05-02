import WebSocket from 'ws';
import Gateway from '../../classes/gateway.class';
import LiveSocket from './live.socket';

class LiveGateway extends Gateway {
  protected onListening(): void {
    console.log('Gateway listening');
  }

  protected onConnection(webSocket: WebSocket) {
    const socket = new LiveSocket(webSocket);
  }
}

export default LiveGateway;
