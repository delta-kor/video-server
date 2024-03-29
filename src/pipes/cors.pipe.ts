import { Application, NextFunction } from 'express';

class CorsPipe {
  public static use(application: Application): void {
    application.use(function cors(req: TypedRequest, res: TypedResponse, next: NextFunction) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Expose-Headers', 'Iz-Auth-Token');
      next();
    });
  }
}

export default CorsPipe;
