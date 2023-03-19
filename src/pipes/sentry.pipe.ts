import { Application } from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';

class SentryPipe {
  public static use(application: Application): void {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new RewriteFrames({
          root: global.__dirname,
        }),
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app: application }),
      ],

      tracesSampleRate: 1.0,
    });

    application.use(Sentry.Handlers.requestHandler());
    application.use(Sentry.Handlers.tracingHandler());
  }
}

export default SentryPipe;
