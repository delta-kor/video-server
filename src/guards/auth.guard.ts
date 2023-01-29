import { NextFunction } from 'express';
import UnauthorizedException from '../exceptions/unauthorized.exception';
import UserService from '../modules/user/user.service';
import ServiceProvider from '../services/provider.service';

function AuthGuard(create: boolean): Route {
  return async function (req: TypedRequest, res: TypedResponse, next: NextFunction): Promise<void> {
    const userService: UserService = ServiceProvider.get(UserService);

    const header = req.headers.authorization as string;
    if (!header) {
      if (!create) throw new UnauthorizedException();
      req.user = await userService.createUser();
      res.header('Iz-Auth-Token', req.user.createToken());
      return next();
    }

    const [type, credentials] = header.split(' ');
    if (type !== 'izflix' || !credentials) {
      if (!create) throw new UnauthorizedException();
      req.user = await userService.createUser();
      res.header('Iz-Auth-Token', req.user.createToken());
      return next();
    }

    req.user = await userService.getUserByToken(credentials, create);
    res.header('Iz-Auth-Token', req.user.createToken());

    req.user.updateActive();

    return next();
  };
}

export default AuthGuard;
