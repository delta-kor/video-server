import HttpException from './http.exception';

class UnavailableVideoException extends HttpException {
  constructor(message: string = 'error.video.unavailable') {
    super(404, message);
  }
}

export default UnavailableVideoException;
