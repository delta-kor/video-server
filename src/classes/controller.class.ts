import { Router } from 'express';
import AsyncUtil from '../utils/async.util';

class ControllerMounter {
  private readonly router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  public get(path: string, ...handlers: Route[]): void {
    this.router.get(path, ...AsyncUtil(handlers));
  }

  public post(path: string, ...handlers: Route[]): void {
    this.router.post(path, ...AsyncUtil(handlers));
  }

  public put(path: string, ...handlers: Route[]): void {
    this.router.put(path, ...AsyncUtil(handlers));
  }

  public patch(path: string, ...handlers: Route[]): void {
    this.router.patch(path, ...AsyncUtil(handlers));
  }

  public delete(path: string, ...handlers: Route[]): void {
    this.router.delete(path, ...AsyncUtil(handlers));
  }
}

abstract class Controller {
  public abstract readonly path: string;
  public readonly router: Router = Router();
  protected readonly mounter: ControllerMounter = new ControllerMounter(this.router);

  protected constructor() {
    this.mount();
  }

  protected abstract mount(): void;
}

export default Controller;
