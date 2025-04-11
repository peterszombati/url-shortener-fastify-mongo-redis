import * as crypto from 'crypto';

export function md5buffer(data: string | Buffer) {
  return crypto.createHash('md5').update(data).digest();
}
