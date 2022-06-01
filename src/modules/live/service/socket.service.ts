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

  public removeMultipleConnectedSocket(user: User, except?: LiveSocket): boolean {
    const id = user.id;

    let result: boolean = false;

    for (const socket of this.sockets) {
      if (socket.state !== SocketState.ACTIVE) continue;
      if (except && except === socket) continue;
      if (socket.user!.id === id) {
        socket.onMultipleConnection();
        result = true;
      }
    }

    return result;
  }

  public sendToAllActiveSockets(packet: ServerPacketBase, except?: LiveSocket, exceptUser?: User): void {
    for (const socket of this.sockets) {
      if (socket.state !== SocketState.ACTIVE) continue;
      if (except && except === socket) continue;
      if (exceptUser && socket.user!.id === exceptUser.id) continue;
      socket.sendPacket(packet);
    }
  }

  public sendToAllStaffSockets(packet: ServerPacketBase, except?: LiveSocket, exceptUser?: User): void {
    for (const socket of this.sockets) {
      if (socket.state !== SocketState.ACTIVE) continue;
      if (except && except === socket) continue;
      if (exceptUser && socket.user!.id === exceptUser.id) continue;
      if (!socket.user!.isStaff()) continue;
      socket.sendPacket(packet);
    }
  }

  public userExists(user: User): boolean {
    for (const socket of this.sockets) {
      if (socket.user === user) return true;
    }
    return false;
  }

  public getAllActiveUsers(): User[] {
    const users: User[] = [];
    for (const socket of this.sockets) {
      if (socket.state !== SocketState.ACTIVE) continue;
      users.push(socket.user!);
    }
    return users;
  }
}

export default SocketService;
