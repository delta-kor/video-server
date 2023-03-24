import crypto from 'crypto';
import User from '../modules/user/user.interface';
import LogSpan from './sentry.util';

interface TokenPayload {
  iss: string;
  id: string;
  iat: number;
}

class TokenUtil {
  public static create(user: User): string {
    const span = new LogSpan('token util', 'create token');

    const secret = process.env.SECRET_KEY as string;

    const iss = process.env.TOKEN_VERSION as string;
    const id = user.id;
    const iat = Date.now();
    const payload: TokenPayload = { iss, id, iat };

    const json = JSON.stringify(payload);
    const payloadEncoded = Buffer.from(json, 'utf-8').toString('base64');
    const payloadHashed = crypto.createHash('sha256').update(json).update(secret).digest('base64');

    span.ok();
    return `iz.${payloadEncoded}.${payloadHashed}`;
  }

  public static parse(token: string): TokenPayload | null {
    const span = new LogSpan('token util', 'parse token');

    const secret = process.env.SECRET_KEY as string;
    const iss = process.env.TOKEN_VERSION as string;

    try {
      const parts = token.split('.');
      const [header, payloadEncoded, payloadHashed] = parts;

      if (header !== 'iz' || !payloadEncoded || !payloadHashed) return null;

      const json = Buffer.from(payloadEncoded, 'base64').toString('utf-8');
      const data: TokenPayload = JSON.parse(json);

      const hash = crypto.createHash('sha256').update(json).update(secret).digest('base64');

      if (data.iss !== iss || hash !== payloadHashed) return null;

      span.ok();
      return data;
    } catch (e) {
      console.error(e);

      span.ok();
      return null;
    }
  }
}

export default TokenUtil;
