import Controller from '../../classes/controller.class';
import AuthGuard from '../../guards/auth.guard';
import UserResponse from './user.response';

class UserController extends Controller {
  public readonly path: string = '/user';

  protected mount(): void {
    this.mounter.get('/', AuthGuard, this.get.bind(this));
  }

  private async get(req: TypedRequest, res: TypedResponse<UserResponse.Get>): Promise<void> {
    const user = req.user!;
    const serializedUser = user.serialize('id', 'nickname', 'role');

    const token = user.createToken();

    res.json({ ok: true, user: serializedUser, token });
  }
}

export default UserController;
