import crypto from 'crypto';
import User from '../modules/user/user.interface';

interface TokenPayload {
  iss: string;
  id: string;
  iat: number;
}

class TokenUtil {
  public static create(user: User): string {
    const secret = process.env.SECRET_KEY as string;

    const iss = process.env.TOKEN_VERSION as string;
    const id = user.id;
    const iat = Date.now();
    const payload: TokenPayload = { iss, id, iat };

    const json = JSON.stringify(payload);
    const payloadEncoded = Buffer.from(json, 'utf-8').toString('base64');
    const payloadHashed = crypto.createHash('sha256').update(json).update(secret).digest('base64url');

    return `iz.${payloadEncoded}.${payloadHashed}`;
  }

  public static parse(token: string): TokenPayload | null {
    const secret = process.env.SECRET_KEY as string;
    const iss = process.env.TOKEN_VERSION as string;

    try {
      const parts = token.split('.');
      const [header, payloadEncoded, payloadHashed] = parts;

      if (header !== 'iz' || !payloadEncoded || !payloadHashed) return null;

      const json = Buffer.from(payloadEncoded, 'base64').toString('utf-8');
      const data: TokenPayload = JSON.parse(json);

      const hash = crypto.createHash('sha256').update(json).update(secret).digest('base64url');

      if (data.iss !== iss || hash !== payloadHashed) return null;

      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default TokenUtil;
