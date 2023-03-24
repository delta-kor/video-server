import * as Sentry from '@sentry/node';

function SentryLog(operation: string, description: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
      const span = transaction && transaction.startChild({ op: operation, description: description });

      const promise = originalMethod.apply(this, args);
      if (promise instanceof Promise) {
        promise
          .then(() => {
            span?.setStatus('ok');
            span?.finish();
          })
          .catch(() => {
            span?.setStatus('internal_error');
            span?.finish();
          });
      } else {
        span?.setStatus('ok');
        span?.finish();
      }

      return promise;
    };

    return descriptor;
  };
}

export { SentryLog };
