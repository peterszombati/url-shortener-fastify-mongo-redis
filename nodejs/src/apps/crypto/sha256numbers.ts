import * as crypto from 'crypto';

export function sha256numbers(data: string | Buffer): number[] {
  return Array.from(crypto.createHash('sha256').update(data).digest());
}
