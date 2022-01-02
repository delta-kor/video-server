import crypto from 'crypto';

function GenerateId(length: number): string {
  return crypto.randomBytes(length / 2).toString('hex');
}

export default GenerateId;
