import crypto from 'crypto';
import SocketException from '../exceptions/socket.exception';
import UnauthorizedException from '../exceptions/unauthorized.exception';

function parseTicket(ticket: string): string {
  const parts = ticket.split('.');
  if (parts.length !== 3) throw new SocketException();
  const ip = parts[0];
  const key = parts[1];
  const trueHash = parts[2];
  const secret = process.env.SECRET_KEY as string;

  const hash = crypto
    .createHash('md5')
    .update(ip + key)
    .update(secret)
    .digest('hex');

  if (hash !== trueHash) throw new UnauthorizedException();

  return Buffer.from(ip, 'hex').toString('utf-8');
}

export default parseTicket;
