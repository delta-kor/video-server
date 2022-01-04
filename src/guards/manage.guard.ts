import { NextFunction } from 'express';
import UnauthorizedException from '../exceptions/unauthorized.exception';

async function ManageGuard(
  req: TypedRequest<{ key?: string }, { key?: string }>,
  res: TypedResponse,
  next: NextFunction
): Promise<void> {
  const key = req.body.key || req.query.key;
  if (!key || key !== process.env.SECRET_KEY) throw new UnauthorizedException();
  next();
}

export default ManageGuard;
