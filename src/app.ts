import EventEmitter from 'events';
import express, { Application, json } from 'express';
import { Server } from 'http';
import mongoose from 'mongoose';
import { WebSocketServer } from 'ws';
import Controller from './classes/controller.class';
import Gateway from './classes/gateway.class';
import ExceptionFilter from './filters/exception.filter';
import CorsPipe from './pipes/cors.pipe';
import I18nPipe from './pipes/i18n.pipe';
import LogPipe from './pipes/log.pipe';
import SentryPipe from './pipes/sentry.pipe';
import SentryFilter from './filters/sentry.filter';

declare interface App {
  on(event: 'load', listener: () => void): this;
  on(event: 'connect', listener: () => void): this;
  on(event: 'start', listener: (port: number) => void): this;
}

class App extends EventEmitter {
  private ready: boolean = false;
  private gateway?: typeof Gateway;
  private readonly port: number;
  private readonly application: Application = express();

  constructor(port: number) {
    super();
    this.port = port;
  }

  public async load(controllers: Controller[], gateway: typeof Gateway): Promise<void> {
    this.gateway = gateway;

    this.loadPipes();
    this.loadControllers(controllers);
    this.loadFilters();

    this.ready = true;
    this.emit('load');
  }

  public async connect(): Promise<void> {
    await mongoose.connect(process.env.DB_PATH!);
    this.emit('connect');
  }

  private loadPipes(): void {
    this.application.disable('x-powered-by');
    SentryPipe.use(this.application);
    LogPipe.use(this.application);
    I18nPipe.use(this.application);
    CorsPipe.use(this.application);
    this.application.use(json());
  }

  private loadControllers(controllers: Controller[]): void {
    controllers.forEach(controller => this.application.use(controller.path, controller.router));
  }

  private loadFilters(): void {
    SentryFilter.use(this.application);
    ExceptionFilter.use(this.application);
  }

  private loadGateway(server: Server): void {
    const socketServer = new WebSocketServer({ server });
    const gateway = new this.gateway!(socketServer);
    gateway.load();
  }

  public async start(): Promise<void> {
    if (!this.ready) throw new Error('Application is not loaded yet');
    const server = this.application.listen(this.port, () => this.emit('start', this.port));
    this.loadGateway(server);
  }
}

export default App;
