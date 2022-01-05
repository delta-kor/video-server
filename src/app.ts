import EventEmitter from 'events';
import express, { Application, json } from 'express';
import mongoose from 'mongoose';
import Controller from './classes/controller.class';
import ExceptionFilter from './filters/exception.filter';
import CorsPipe from './pipes/cors.pipe';

declare interface App {
  on(event: 'load', listener: () => void): this;
  on(event: 'connect', listener: () => void): this;
  on(event: 'start', listener: (port: number) => void): this;
}

class App extends EventEmitter {
  private ready: boolean = false;
  private readonly port: number;
  private readonly application: Application = express();

  constructor(port: number) {
    super();
    this.port = port;
  }

  public async load(controllers: Controller[]): Promise<void> {
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
    this.application.use(json());
    CorsPipe.use(this.application);
  }

  private loadControllers(controllers: Controller[]): void {
    controllers.forEach(controller => this.application.use(controller.path, controller.router));
  }

  private loadFilters(): void {
    ExceptionFilter.use(this.application);
  }

  public async start(): Promise<void> {
    if (!this.ready) throw new Error('Application is not loaded yet');
    this.application.listen(this.port, () => this.emit('start', this.port));
  }
}

export default App;
