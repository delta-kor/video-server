import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction } from 'express';
import UnprocessableEntityException from '../exceptions/unprocessable-entity.exception';

type ValidationType = 'body' | 'query' | 'param';

function ValidateGuard(type: any, query: ValidationType = 'body', skipMissingProperties = false): Route {
  return async function (req: TypedRequest, res: TypedResponse, next: NextFunction): Promise<void> {
    const plain = query === 'body' ? req.body : query === 'query' ? req.query : req.params;
    validate(plainToClass(type, plain), { skipMissingProperties }).then(err => {
      if (err.length > 0) {
        const values = Object.values(err[0].constraints!);
        next(new UnprocessableEntityException(values[values.length - 1]));
      } else {
        next();
      }
    });
  };
}

export default ValidateGuard;
