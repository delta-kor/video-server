import { NextFunction } from 'express';
import UnauthorizedException from '../exceptions/unauthorized.exception';
import CampdService from '../modules/campd/campd.service';
import ServiceProvider from '../services/provider.service';
import CampdUserModel from '../modules/campd/model/campd-user.model';

function CampdGuard(): Route {
  return async function (req: TypedRequest, res: TypedResponse, next: NextFunction): Promise<void> {
    const user = req.user;
    if (!user) throw new UnauthorizedException();

    const campdService: CampdService = ServiceProvider.get(CampdService);
    const campdUser = await campdService.getCampdUserById(user.id);

    if (!campdUser) {
      const newCampdUser = new CampdUserModel({ id: user.id, scoreboard: {} });
      await newCampdUser.save();
    }

    next();
  };
}

export default CampdGuard;
