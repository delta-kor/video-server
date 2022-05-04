import Service from '../../../services/base.service';
import User from '../interface/user.interface';
import { ServerPacketBase } from '../live.packet';
import LiveSocket, { SocketState } from '../live.socket';

class SocketService extends Service {
  private sockets: Set<LiveSocket> = new Set();

  public addSocket(socket: LiveSocket): void {
    this.sockets.add(socket);
  }

  public removeSocket(socket: LiveSocket): void {
    this.sockets.delete(socket);
  }

  public removeUser(user: User, except?: LiveSocket): void {
    const id = user.id;

    for (const socket of this.sockets) {
      if (socket.state !== SocketState.ACTIVE) continue;
      if (except && except === socket) continue;
      if (socket.user!.id === id) {
        socket.onMultipleDevice();
      }
    }
  }

  public sendToAllActiveSocket(packet: ServerPacketBase, except?: LiveSocket): void {
    for (const socket of this.sockets) {
      if (socket.state !== SocketState.ACTIVE) continue;
      if (except && except === socket) continue;
      socket.sendPacket(packet);
    }
  }
}

export default SocketService;
