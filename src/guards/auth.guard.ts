import { NextFunction } from 'express';
import UnauthorizedException from '../exceptions/unauthorized.exception';
import UserService from '../modules/user/user.service';
import ServiceProvider from '../services/provider.service';
import LogSpan from '../utils/sentry.util';

function AuthGuard(create: boolean): Route {
  return async function (req: TypedRequest, res: TypedResponse, next: NextFunction): Promise<void> {
    const span = new LogSpan('auth guard');
    const userService: UserService = ServiceProvider.get(UserService);

    const header = req.headers.authorization as string;
    if (!header) {
      if (!create) throw new UnauthorizedException();
      req.user = await userService.createUser();
      res.header('Iz-Auth-Token', req.user.createToken());

      span.ok();
      return next();
    }

    const [type, credentials] = header.split(' ');
    if (type !== 'izflix' || !credentials) {
      if (!create) throw new UnauthorizedException();
      req.user = await userService.createUser();
      res.header('Iz-Auth-Token', req.user.createToken());

      span.ok();
      return next();
    }

    req.user = await userService.getUserByToken(credentials, create);
    res.header('Iz-Auth-Token', req.user.createToken());

    const ip: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.user.updateActive(ip);

    span.ok();
    return next();
  };
}

export default AuthGuard;
