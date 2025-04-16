import {analyticsRedirects} from './db/analytics-redirects';
import {Queue} from "../queue/Queue";
import {redis} from "../redis/connection";

export const saveRedirect = Queue(redis.connection, "analytics/saveRedirect", async ({alias, date}: {
  alias: string,
  date: Date
}) => {
  const entity = new analyticsRedirects.model({
    alias,
    createdAt: date,
  });
  await entity.save();
})