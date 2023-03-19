import { Application } from 'express';
import morgan from 'morgan';
import chalk from 'chalk';

class LogPipe {
  public static use(application: Application): void {
    application.use(
      morgan(
        (tokens, req, res) => {
          const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          // prettier-ignore
          return `${chalk.bgGray.bold(new Date().toLocaleTimeString('en'))} ${chalk.red(ip)} - ${chalk.green(tokens['method'](req, res))} ${tokens['url'](req, res)} ${chalk.magenta(tokens['status'](req, res))} ${chalk.blue(tokens['res'](req, res, 'content-length') || 0)}bytes ${chalk.yellow(tokens['response-time'](req, res))}ms`;
        },
        { skip: req => req.method === 'OPTIONS' }
      )
    );
  }
}

export default LogPipe;
