import { toBase62 } from '../utils/toBase62';
import { calculateIdFromNumberArrayAndRange } from './calculateIdFromNumberArrayAndRange';
import { sha256numbers } from '../crypto/sha256numbers';

export function longToShort(
  longUrl: string,
  indexRange: [number, number] /* 0-238326*/, // index range is for make possible to run on different nodes perfectly not to generate the same number in the same time
): {
  generatedId: number;
  shortened: string;
} {
  if (indexRange[1] > 238326 || indexRange[1] < 0 || indexRange[1] % 1 != 0) {
    throw new Error('Invalid index');
  }
  if (indexRange[0] > indexRange[1] || indexRange[0] < 0 || indexRange[0] % 1 != 0) {
    throw new Error('Invalid index');
  }
  const buffer = Array.from(sha256numbers(longUrl));
  const generatedId = calculateIdFromNumberArrayAndRange(buffer, indexRange);
  const shortenString = toBase62(generatedId.result);
  // 238327*238329 = [61,61,61,61,61,61].reduce((a,b,i)=>a+b*Math.pow(62,i))
  return {
    generatedId: generatedId.result,
    shortened: '0'.repeat(Math.max(0, 6 - shortenString.length)) + shortenString,
  };
}
