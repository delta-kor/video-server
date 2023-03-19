import { Application, NextFunction } from 'express';
import UserService from '../modules/user/user.service';
import ServiceProvider from '../services/provider.service';

class AuthPipe {
  public static use(application: Application): void {
    application.use(async (req: TypedRequest, res: TypedResponse, next: NextFunction) => {
      const userService: UserService = ServiceProvider.get(UserService);

      const header = req.headers.authorization as string;
      if (!header) return next();

      const [type, credentials] = header.split(' ');
      if (type !== 'izflix-ig' || !credentials) return next();

      try {
        req.user = await userService.getUserByToken(credentials, false);
        res.header('Iz-Auth-Token', req.user.createToken());
        req.user.updateActive();
      } catch (e) {
        next();
      }

      return next();
    });
  }
}

export default AuthPipe;
