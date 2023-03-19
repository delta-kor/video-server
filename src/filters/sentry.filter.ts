import { Application } from 'express';
import * as Sentry from '@sentry/node';

class SentryFilter {
  public static use(application: Application): void {
    if (process.env.NODE_ENV !== 'production') return;

    application.use(Sentry.Handlers.errorHandler());
  }
}

export default SentryFilter;
