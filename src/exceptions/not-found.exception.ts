import HttpException from './http.exception';

class NotFoundException extends HttpException {
  constructor(message: string = 'error.not_found') {
    super(404, message);
  }
}

export default NotFoundException;
