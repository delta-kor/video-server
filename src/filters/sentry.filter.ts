import { Application } from 'express';
import * as Sentry from '@sentry/node';

class SentryFilter {
  public static use(application: Application): void {
    application.use(Sentry.Handlers.errorHandler());
  }
}

export default SentryFilter;
