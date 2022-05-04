import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import User from '../interface/user.interface';
import { ServerPacket } from '../live.packet';
import LiveSocket from '../live.socket';
import SocketService from './socket.service';
import UserService from './user.service';

class LiveService extends Service {
  private readonly socketService: SocketService = ServiceProvider.get(SocketService);
  private readonly userService: UserService = ServiceProvider.get(UserService);

  public onConnect(socket: LiveSocket): void {
    this.socketService.addSocket(socket);
  }

  public onDisconnect(socket: LiveSocket): void {
    this.socketService.removeSocket(socket);
  }

  public onHello(socket: LiveSocket, user: User): void {
    this.socketService.removeUser(user, socket);

    const packet: ServerPacket.UserConnect = {
      type: 'user-connect',
      packet_id: null,
      user_info: user.info(),
    };
    this.socketService.sendToAllActiveSocket(packet, socket);
  }

  public async getUser(token: string | null): Promise<User> {
    return await this.userService.getUserByToken(token);
  }
}

export default LiveService;
