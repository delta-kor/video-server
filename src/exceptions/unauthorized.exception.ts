import HttpException from './http.exception';

class UnauthorizedException extends HttpException {
  constructor(message: string = 'error.unauthorized') {
    super(401, message);
  }
}

export default UnauthorizedException;
