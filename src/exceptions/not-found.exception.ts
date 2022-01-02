import Constants from '../constants';
import HttpException from './http.exception';

class NotFoundException extends HttpException {
  constructor(message: string = Constants.PAGE_NOT_FOUND) {
    super(404, message);
  }
}

export default NotFoundException;
