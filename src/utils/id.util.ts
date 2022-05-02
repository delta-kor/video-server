import crypto from 'crypto';

function generateId(length: number): string {
  return crypto.randomBytes(length / 2).toString('hex');
}

export default generateId;
