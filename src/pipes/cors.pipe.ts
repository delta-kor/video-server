import { Application, NextFunction } from 'express';

class CorsPipe {
  public static use(application: Application): void {
    application.use((req: TypedRequest, res: TypedResponse, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      next();
    });
  }
}

export default CorsPipe;
