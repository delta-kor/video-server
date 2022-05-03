import Service from '../../../services/base.service';
import LiveSocket from '../live.socket';

class SocketService extends Service {
  private sockets: Set<LiveSocket> = new Set();

  public addSocket(socket: LiveSocket): void {
    this.sockets.add(socket);
  }

  public removeSocket(socket: LiveSocket): void {
    this.sockets.delete(socket);
  }
}

export default SocketService;
