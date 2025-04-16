import { longToShort } from './longToShort';
import { saveURL } from './saveURL';
import { mongoTransaction } from '../mongo/mongoTransaction';
import { generateUniqueId } from './generateUniqueId';
import { toBase62 } from '../utils/toBase62';
import { RequestContext } from '../http-handler';
import { Queue } from '../queue/Queue';
import { redis } from '../redis/connection';

const SEVEN_DAYS_IN_MS = 604800000;

export const generateURL = Queue(
  redis.connection,
  'url-shortener/generateURL',
  async ({
    context,
    longUrl,
    expireAt,
  }: {
    context: RequestContext;
    longUrl: string;
    expireAt?: Date;
  }, worker: [number, number]) => {
    expireAt = expireAt || new Date(new Date().getTime() + SEVEN_DAYS_IN_MS);
    return await mongoTransaction(async (session) => {
      const indexRange: [number, number] = [worker[0], worker[1]];
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
        return saveURL({
          longUrl,
          alias: toBase62(id),
          generatedId: id,
          context,
          expireAt,
          session,
        });
      });
    });
  },
);
