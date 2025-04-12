import { rateLimit } from './rateLimit';
import { url } from './db/url';
import { rateLimitSave } from './rateLimitSave';
import { ClientSession } from 'mongoose';
import {RequestContext} from "../http-handler";

export async function saveURL({
  context,
  longUrl,
  alias,
  generatedId,
  expireAt,
  session,
}: {
  context: RequestContext;
  longUrl: string;
  alias: string;
  generatedId?: number | undefined;
  expireAt: Date;
  session: ClientSession | null;
}) {
  await rateLimit(context);

  const newUrl = new url.model({
    alias,
    longUrl,
    generatedId,
    // @ts-ignore
    userId: context.userId,
    createdAt: new Date(),
    expireAt,
  });

  await newUrl.save({ session });
  rateLimitSave(context, session).catch((e) => console.error(e));
  return alias;
}
