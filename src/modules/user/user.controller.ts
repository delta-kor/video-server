import Controller from '../../classes/controller.class';
import AuthGuard from '../../guards/auth.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import UserDto from './dto/user.dto';
import UserResponse from './user.response';
import UserService from './user.service';
import { SentryLog } from '../../decorators/sentry.decorator';

class UserController extends Controller {
  public readonly path: string = '/user';
  private readonly userService: UserService = ServiceProvider.get(UserService);

  protected mount(): void {
    this.mounter.post('/', AuthGuard(true), this.get.bind(this));
    this.mounter.put('/', ValidateGuard(UserDto, 'body', true), AuthGuard(false), this.update.bind(this));
  }

  @SentryLog('user controller', 'get user')
  private async get(req: TypedRequest, res: TypedResponse<UserResponse.Get>): Promise<void> {
    const user = req.user!;
    const serializedUser = user.serialize('id', 'nickname', 'role');

    res.json({ ok: true, user: serializedUser });
  }

  @SentryLog('user controller', 'update user')
  private async update(req: TypedRequest<UserDto>, res: TypedResponse<UserResponse.Update>): Promise<void> {
    const user = req.user!;
    const id = user.id;

    const updatedUser = await this.userService.updateUser(id, req.body);
    const serializedUser = updatedUser.serialize('id', 'nickname', 'role');

    res.json({ ok: true, user: serializedUser });
  }
}

export default UserController;
