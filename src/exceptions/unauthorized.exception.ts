import Constants from '../constants';
import HttpException from './http.exception';

class UnauthorizedException extends HttpException {
  constructor() {
    super(401, Constants.UNAUTHORIZED);
  }
}

export default UnauthorizedException;
