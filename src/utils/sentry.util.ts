import * as Sentry from '@sentry/node';
import { Span } from '@sentry/node';

class LogSpan {
  private readonly span: Span | undefined;

  constructor(operation: string, description?: string) {
    const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
    this.span = transaction && transaction.startChild({ op: operation, description: description });
  }

  public ok(): void {
    this.span?.setStatus('ok');
    this.span?.finish();
  }
}

export default LogSpan;
