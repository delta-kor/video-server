import { NextFunction } from 'express';
import UserService from '../modules/user/user.service';
import ServiceProvider from '../services/provider.service';

async function AuthGuard(req: TypedRequest, res: TypedResponse, next: NextFunction): Promise<void> {
  const userService: UserService = ServiceProvider.get(UserService);

  const header = req.headers.authorization as string;
  if (!header) {
    req.user = await userService.createUser();
    return next();
  }

  const [type, credentials] = header.split(' ');
  if (type !== 'izflix' || !credentials) {
    req.user = await userService.createUser();
    return next();
  }

  req.user = await userService.getUserByToken(credentials);
  return next();
}

export default AuthGuard;
