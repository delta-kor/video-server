import { Application, NextFunction } from 'express';

class CorsPipe {
  public static use(application: Application): void {
    application.use((req: TypedRequest, res: TypedResponse, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }
}

export default CorsPipe;
