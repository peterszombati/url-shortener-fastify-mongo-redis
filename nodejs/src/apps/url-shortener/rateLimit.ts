import {ResponseError} from '../http-handler/ResponseError';
import {RequestContext} from '../http-handler';
import {perDay} from "../redis-rate-limit/perDay";

export async function rateLimit(context: RequestContext, date: Date) {
  const enabled = await perDay.run([
    // @ts-ignore
    `redis-rate-limit:url-shortener:{${context.userId}}:${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`,
  ], 10).catch(e => {
    console.error(e)
    return 0
  })

  if (!enabled) {
    throw new ResponseError({
      statusCode: 429,
      message: 'Rate limit reached',
    });
  }
}
