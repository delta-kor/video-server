import Service from '../../../services/base.service';
import User from '../interface/user.interface';
import LiveSocket, { SocketState } from '../live.socket';

class SocketService extends Service {
  private sockets: Set<LiveSocket> = new Set();

  public addSocket(socket: LiveSocket): void {
    this.sockets.add(socket);
  }

  public removeSocket(socket: LiveSocket): void {
    this.sockets.delete(socket);
  }

  public removeUserExcept(user: User, except: LiveSocket): void {
    const id = user.id;

    for (const socket of this.sockets) {
      if (socket.state !== SocketState.READY) continue;
      if (socket.user!.id === id && except !== socket) {
        socket.onMultipleDevice();
      }
    }
  }
}

export default SocketService;
