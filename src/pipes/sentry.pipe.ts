import { Application } from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { RewriteFrames } from '@sentry/integrations';
import { ProfilingIntegration } from '@sentry/profiling-node';

class SentryPipe {
  public static use(application: Application): void {
    if (process.env.NODE_ENV !== 'production') return;

    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new RewriteFrames({
          root: global.__dirname,
        }),
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app: application }),
        new Tracing.Integrations.Mongo({ useMongoose: true }),
        new ProfilingIntegration(),
      ],
      beforeSendTransaction: event => {
        const ignores = ['POST /video/:id/beacon', 'GET /thumbnail/:id', 'GET /log/beacon'];
        if (event.transaction && ignores.includes(event.transaction)) return null;
        return event;
      },
      tracesSampleRate: 0.1,
      profilesSampleRate: 1,
    });

    application.use(Sentry.Handlers.requestHandler());
    application.use(Sentry.Handlers.tracingHandler());
  }
}

export default SentryPipe;
