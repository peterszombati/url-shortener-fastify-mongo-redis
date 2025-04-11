import { urlRatelimit } from './db/url-ratelimit';
import { ResponseError } from '../http-handler/ResponseError';

export async function rateLimit(userId: string) {
  const date = new Date();
  const utcDate = new Date(`${date.getUTCFullYear()}-01-01T00:00:00.000Z`);
  utcDate.setUTCMonth(date.getUTCMonth());
  utcDate.setUTCDate(date.getUTCDate());

  const result = await urlRatelimit.model.findOne(
    {
      utcDate,
      userId,
    },
    {},
    { projection: { count: 1, _id: 0 } },
  );

  if (result && result.count > 9) {
    throw new ResponseError({
      statusCode: 429,
      message: 'Rate limit reached',
    });
  }
}
