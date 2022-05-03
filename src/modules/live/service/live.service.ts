import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import LiveSocket from '../live.socket';
import SocketService from './socket.service';

class LiveService extends Service {
  private readonly socketService: SocketService = ServiceProvider.get(SocketService);

  public onConnect(socket: LiveSocket): void {
    this.socketService.addSocket(socket);
  }

  public onDisconnect(socket: LiveSocket): void {
    this.socketService.removeSocket(socket);
  }
}

export default LiveService;
