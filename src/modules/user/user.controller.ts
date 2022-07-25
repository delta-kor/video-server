import Controller from '../../classes/controller.class';
import AuthGuard from '../../guards/auth.guard';
import ValidateGuard from '../../guards/validate.guard';
import ServiceProvider from '../../services/provider.service';
import UserDto from './dto/user.dto';
import UserResponse from './user.response';
import UserService from './user.service';

class UserController extends Controller {
  public readonly path: string = '/user';
  private readonly userService: UserService = ServiceProvider.get(UserService);

  protected mount(): void {
    this.mounter.get('/', AuthGuard, this.get.bind(this));
    this.mounter.put('/', ValidateGuard(UserDto, 'body', true), AuthGuard, this.update.bind(this));
  }

  private async get(req: TypedRequest, res: TypedResponse<UserResponse.Get>): Promise<void> {
    const user = req.user!;
    const serializedUser = user.serialize('id', 'nickname', 'role');

    const token = user.createToken();

    res.json({ ok: true, user: serializedUser, token });
  }

  private async update(req: TypedRequest<UserDto>, res: TypedResponse<UserResponse.Update>): Promise<void> {
    const user = req.user!;
    const id = user.id;

    const updatedUser = await this.userService.updateUser(id, req.body);
    const serializedUser = updatedUser.serialize('id', 'nickname', 'role');

    const token = user.createToken();

    res.json({ ok: true, user: serializedUser, token });
  }
}

export default UserController;
