import { Application, NextFunction } from 'express';
import HttpException from '../exceptions/http.exception';
import NotFoundException from '../exceptions/not-found.exception';

interface ApiErrorResponse extends ApiResponse {
  message: string;
}

class ExceptionFilter {
  public static use(application: Application): void {
    application.use((_req, _res) => {
      throw new NotFoundException();
    });

    application.use((err: Error, req: TypedRequest, res: TypedResponse<ApiErrorResponse>, _next: NextFunction) => {
      if (err instanceof HttpException) {
        const message = req.i18n.exists(err.message) ? req.t(err.message) : err.message;

        res.status(err.status);
        res.json({ ok: false, message });
        return true;
      }

      console.error(err.name, err.message, err.stack);
      res.status(500);
      res.json({ ok: false, message: req.t('error.internal_server_error') });
      return true;
    });
  }
}

export default ExceptionFilter;
