import UserDocument from '../modules/user/user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
