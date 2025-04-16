import { urlRatelimit } from './db/url-ratelimit';
import { ClientSession } from 'mongoose';
import { RequestContext } from '../http-handler';

export async function rateLimitSave(context: RequestContext, session: ClientSession | null) {
  const date = new Date();
  const utcDate = new Date(`${date.getUTCFullYear()}-01-01T00:00:00.000Z`);
  utcDate.setUTCMonth(date.getUTCMonth());
  utcDate.setUTCDate(date.getUTCDate());

  await urlRatelimit.model
    .updateOne(
      {
        utcDate,
        // @ts-ignore
        userId: context.userId,
      },
      {
        $inc: { count: 1 },
      },
      { upsert: true },
    )
    .session(session);
}
