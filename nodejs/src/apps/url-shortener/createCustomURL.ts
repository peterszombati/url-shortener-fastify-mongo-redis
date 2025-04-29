import { saveURL } from './saveURL';
import { fromBase62ToNumber } from '../utils/fromBase62ToNumber';
import { mongoTransaction } from '../mongo/mongoTransaction';
import { ResponseError } from '../http-handler/ResponseError';
import { RequestContext } from '../http-handler';
import { Queue } from '../queue/Queue';
import { redis } from '../redis/connection';
import { rateLimit } from './rateLimit';

const SEVEN_DAYS_IN_MS = 604800000;

export const createCustomURL = Queue(
  redis.connection,
  'url-shortener/createCustomURL',
  async ({
    context,
    longUrl,
    customAlias,
    expireAt,
  }: {
    context: RequestContext;
    longUrl: string;
    customAlias: string;
    expireAt?: Date;
  }) => {
    return await mongoTransaction(async (session) => {
      const date = new Date();
      if (customAlias.match(/[\/\\]/g)) {
        throw new ResponseError({
          statusCode: 400,
          message: "Invalid customAlias"
        })
      }
      if (customAlias.length > 200) {
        throw new ResponseError({
          statusCode: 400,
          message: "Too long customAlias"
        })
      }
      const generatedId = customAlias.match(/^[a-zA-Z0-9]{6}$/g)
        ? fromBase62ToNumber(customAlias)
        : undefined;
      await rateLimit(context, date);
      return await saveURL({
        context,
        longUrl,
        alias: customAlias,
        generatedId,
        expireAt: expireAt || new Date(new Date().getTime() + SEVEN_DAYS_IN_MS),
        session,
        date,
      }).catch((e) => {
        if (e.code !== 11000) {
          throw e;
        }
        throw new ResponseError({
          statusCode: 406,
          message: 'Alias already exists',
        });
      });
    });
  },
);
