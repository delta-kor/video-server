import Constants from '../constants';
import HttpException from './http.exception';

class SocketException extends HttpException {
  constructor(message: string = Constants.WRONG_REQUEST) {
    super(400, message);
  }
}

export default SocketException;
