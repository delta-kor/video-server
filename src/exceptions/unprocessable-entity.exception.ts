import HttpException from './http.exception';

class UnprocessableEntityException extends HttpException {
  constructor(message: string) {
    super(422, message);
  }
}

export default UnprocessableEntityException;
