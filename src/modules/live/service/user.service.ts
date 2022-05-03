import Service from '../../../services/base.service';
import ServiceProvider from '../../../services/provider.service';
import EnvService from '../../env/env.service';
import User from '../interface/user.interface';
import UserModel from '../model/user.model';

class UserService extends Service {
  private readonly envService: EnvService = ServiceProvider.get(EnvService);

  public async createUser(): Promise<User> {
    const lastUserNumber = await this.envService.get<number>('user_index');
    let currentNumber = lastUserNumber! + 1;
    let nickname = `WIZ-${currentNumber}`;

    while (await UserModel.nicknameExists(nickname)) {
      currentNumber++;
      nickname = `WIZ-${currentNumber}`;
    }

    const user = new UserModel({ nickname, role: 0 }) as User;

    await user.save();
    this.envService.set('user_index', currentNumber);

    return user;
  }

  public async getUserByToken(token: string | null): Promise<User> {
    let user: User;

    if (!token) user = await this.createUser();

    return user!;
  }
}

export default UserService;
