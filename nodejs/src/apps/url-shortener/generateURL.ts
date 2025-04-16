import { longToShort } from './longToShort';
import { saveURL } from './saveURL';
import { mongoTransaction } from '../mongo/mongoTransaction';
import { generateUniqueId } from './generateUniqueId';
import { toBase62 } from '../utils/toBase62';
import { randomInteger } from '../utils/randomInteger';
import { RequestContext } from '../http-handler';

const SEVEN_DAYS_IN_MS = 604800000;

export async function generateURL(
  context: RequestContext,
  longUrl: string,
  {
    expireAt,
  }: {
    expireAt?: Date;
  } = {},
) {
  expireAt = expireAt || new Date(new Date().getTime() + SEVEN_DAYS_IN_MS);
  return await mongoTransaction(async (session) => {
    const usedIndex = randomInteger({ min: 0, range: 238326 });
    const indexRange: [number, number] = [usedIndex, usedIndex];
    const { generatedId, shortened } = longToShort(longUrl, indexRange);
    return await saveURL({
      context,
      longUrl,
      alias: shortened,
      generatedId,
      expireAt: expireAt,
      session,
    }).catch(async (e) => {
      if (e.code !== 11000) {
        throw e;
      }
      const id = await generateUniqueId(generatedId, indexRange);
      return saveURL({ longUrl, alias: toBase62(id), generatedId: id, context, expireAt, session });
    });
  });
}
