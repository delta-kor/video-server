import { Application, NextFunction } from 'express';
import Constants from '../constants';
import HttpException from '../exceptions/http.exception';
import NotFoundException from '../exceptions/not-found.exception';

interface ApiErrorResponse extends ApiResponse {
  message: string;
}

class ExceptionFilter {
  public static use(application: Application): void {
    application.use(() => {
      throw new NotFoundException();
    });

    application.use((err: Error, req: TypedRequest, res: TypedResponse<ApiErrorResponse>, _next: NextFunction) => {
      if (err instanceof HttpException) {
        res.status(err.status);
        res.json({ ok: false, message: err.message });
        return true;
      }

      console.error(err.name, err.message, err.stack);
      res.json({ ok: false, message: Constants.INTERNAL_SERVER_ERROR });
      return true;
    });
  }
}

export default ExceptionFilter;
