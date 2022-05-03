import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import EnvService from '../../env/env.service';
import User from '../interface/user.interface';
import LiveSocket from '../live.socket';
import UserModel from '../model/user.model';
import SocketService from './socket.service';

class LiveService extends Service {
  private readonly envService: EnvService = ServiceProvider.get(EnvService);
  private readonly socketService: SocketService = ServiceProvider.get(SocketService);

  public onConnect(socket: LiveSocket): void {
    this.socketService.addSocket(socket);
  }

  public onDisconnect(socket: LiveSocket): void {
    this.socketService.removeSocket(socket);
  }

  public async getUser(token: string | null): Promise<User> {
    let user: User;

    if (!token) {
      const lastUserNumber = await this.envService.get<number>('user_index');
      const currentNumber = lastUserNumber! + 1;
      const nickname = `WIZ-${currentNumber}`;

      user = new UserModel({ nickname, role: 0 }) as User;

      await user.save();
      this.envService.set('user_index', currentNumber);
    }

    return user!;
  }
}

export default LiveService;
