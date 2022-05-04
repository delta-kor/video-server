import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import User from '../interface/user.interface';
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

  public async getUser(token: string | null): Promise<User> {
    return await this.userService.getUserByToken(token);
  }
}

export default LiveService;
