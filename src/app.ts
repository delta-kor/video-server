import EventEmitter from 'events';
import express, { Application } from 'express';

declare interface App {
  on(event: 'load', listener: () => void): this;
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

  public async load(): Promise<void> {
    this.ready = true;
    this.emit('load');
  }

  public async start(): Promise<void> {
    if (!this.ready) throw new Error('Application is not loaded yet');
    this.application.listen(this.port, () => this.emit('start', this.port));
  }
}

export default App;
