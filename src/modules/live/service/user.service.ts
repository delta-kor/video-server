import crypto from 'crypto';
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

  public async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findOne({ id });
    return user || null;
  }

  public async getAllUsersById(id: string[]): Promise<User[]> {
    return UserModel.find({ id: { $in: id } });
  }

  public async getUserByToken(token: string | null): Promise<User> {
    if (!token) return await this.createUser();
    else {
      const parts = token.split('.');
      const id = parts[0];
      const trueHash = parts[1];
      const secret = process.env.SECRET_KEY as string;
      const hash = crypto.createHash('md5').update(id).update(secret).digest('hex');

      if (trueHash !== hash) return this.getUserByToken(null);

      const user = await this.getUserById(id);
      if (!user) return this.getUserByToken(null);

      return user;
    }
  }
}

export default UserService;
