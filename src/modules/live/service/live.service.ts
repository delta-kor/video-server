import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import { ServerPacket } from '../live.packet';
import LiveSocket from '../live.socket';
import SocketService from './socket.service';

class LiveService extends Service {
  private readonly socketService: SocketService = ServiceProvider.get(SocketService);

  public onConnect(socket: LiveSocket): void {
    this.socketService.addSocket(socket);
  }

  public onDisconnect(socket: LiveSocket): void {
    this.socketService.removeSocket(socket);

    if (socket.user) {
      const packet: ServerPacket.UserDisconnect = {
        type: 'user-disconnect',
        packet_id: null,
        id: socket.user.id,
      };
      this.socketService.sendToAllActiveSockets(packet, socket);
    }
  }

  public onConnectionActive(socket: LiveSocket): void {
    const isMultipleConnected = this.socketService.removeMultipleConnectedSocket(socket.user!, socket);

    if (!isMultipleConnected) {
      const userConnectPacket: ServerPacket.UserConnect = {
        type: 'user-connect',
        packet_id: null,
        user_info: socket.user!.info(),
      };
      this.socketService.sendToAllActiveSockets(userConnectPacket, socket);
    }

    const users = this.socketService.getAllActiveUsers();
    const userInfos = users.map(user => user.info());
    const userSyncPacket: ServerPacket.LiveUserSync = {
      type: 'live-user-sync',
      packet_id: null,
      data: userInfos,
    };
    socket.sendPacket(userSyncPacket);
  }
}

export default LiveService;
