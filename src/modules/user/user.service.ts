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

    this.envService.set('user_index', currentNumber);
    await user.save();

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
    if (!token) return this.createUser();

    const payload = TokenUtil.parse(token);
    if (!payload) return this.createUser();

    const id = payload.id;
    const user = await this.getUserById(id);
    if (!user) return this.createUser();

    return user;
  }

  public async nicknameExists(nickname: string): Promise<Boolean> {
    const user = await UserModel.findOne({ nickname });
    return !!user;
  }

  public async updateUser(id: string, data: Partial<UserDto>): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) throw new UnauthorizedException();

    if (user.nickname && (await this.nicknameExists(user.nickname)))
      throw new UnprocessableEntityException('이미 사용중인 닉네임이에요');

    const updater = new Updater<User>(user);
    updater.update(data, 'nickname');
    await updater.save();

    return user;
  }
}

export default UserService;
