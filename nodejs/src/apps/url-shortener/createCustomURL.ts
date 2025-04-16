import { saveURL } from './saveURL';
import { fromBase62ToNumber } from '../utils/fromBase62ToNumber';
import { mongoTransaction } from '../mongo/mongoTransaction';
import { ResponseError } from '../http-handler/ResponseError';
import { RequestContext } from '../http-handler';

const SEVEN_DAYS_IN_MS = 604800000;

export async function createCustomURL(
  context: RequestContext,
  longUrl: string,
  {
    customAlias,
    expireAt,
  }: {
    customAlias: string;
    expireAt?: Date;
  },
) {
  return await mongoTransaction(async (session) => {
    const generatedId = customAlias.match(/^[a-zA-Z0-9]{6}$/g)
      ? fromBase62ToNumber(customAlias)
      : undefined;
    return await saveURL({
      context,
      longUrl,
      alias: customAlias,
      generatedId,
      expireAt: expireAt || new Date(new Date().getTime() + SEVEN_DAYS_IN_MS),
      session,
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
}
