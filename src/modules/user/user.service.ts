import Queue from '../../decorators/queue.decorator';
import UnauthorizedException from '../../exceptions/unauthorized.exception';
import UnprocessableEntityException from '../../exceptions/unprocessable-entity.exception';
import Service from '../../services/base.service';
import ServiceProvider from '../../services/provider.service';
import TokenUtil from '../../utils/token.util';
import Updater from '../../utils/updater';
import EnvService from '../env/env.service';
import UserDto from './dto/user.dto';
import User from './user.interface';
import UserModel from './user.model';
import { SentryLog } from '../../decorators/sentry.decorator';

class UserService extends Service {
  private readonly envService: EnvService = ServiceProvider.get(EnvService);

  @Queue()
  @SentryLog('user service', 'create user')
  public async createUser(): Promise<User> {
    const lastUserNumber = await this.envService.get<number>('user_index');
    let currentNumber = lastUserNumber! + 1;
    let nickname = `WIZ-${currentNumber}`;

    while (await this.nicknameExists(nickname)) {
      currentNumber++;
      nickname = `WIZ-${currentNumber}`;
    }

    const user = new UserModel({ nickname, role: 0 }) as User;

    this.envService.set('user_index', currentNumber);
    await user.save();

    return user;
  }

  @SentryLog('user service', 'get user by id')
  public async getUserById(id: string): Promise<User | null> {
    const user = await UserModel.findOne({ id });
    return user || null;
  }
  @SentryLog('user service', 'get all users by id')
  public async getAllUsersById(id: string[]): Promise<User[]> {
    return UserModel.find({ id: { $in: id } });
  }

  @SentryLog('user service', 'get user by token')
  public async getUserByToken(token: string | null, create: boolean): Promise<User> {
    if (!token) {
      if (!create) throw new UnauthorizedException();
      return this.createUser();
    }

    const payload = TokenUtil.parse(token);
    if (!payload) {
      if (!create) throw new UnauthorizedException();
      return this.createUser();
    }

    const id = payload.id;
    const user = await this.getUserById(id);
    if (!user) {
      if (!create) throw new UnauthorizedException();
      return this.createUser();
    }

    return user;
  }

  @SentryLog('user service', 'nickname exists')
  public async nicknameExists(nickname: string): Promise<Boolean> {
    const user = await UserModel.findOne({ nickname });
    return !!user;
  }

  @SentryLog('user service', 'update user')
  public async updateUser(id: string, data: Partial<UserDto>): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) throw new UnauthorizedException();

    if (data.nickname && data.nickname !== user.nickname && (await this.nicknameExists(data.nickname)))
      throw new UnprocessableEntityException('error.user.nickname_used');

    const updater = new Updater<User>(user);
    updater.update(data, 'nickname');
    await updater.save();

    return user;
  }
}

export default UserService;
