import { rateLimit } from './rateLimit';
import { alias as aliasMongo } from './db/alias';
import { rateLimitSave } from './rateLimitSave';
import { ClientSession } from 'mongoose';
import {RequestContext} from "../http-handler";
import {customAlias} from "./db/custom-alias";

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

  let newUrl;
  if (generatedId === undefined) {
    newUrl = new customAlias.model({
      alias,
      longUrl,
      // @ts-ignore
      userId: context.userId,
      createdAt: new Date(),
      expireAt,
    });
  } else {
    newUrl = new aliasMongo.model({
      alias,
      longUrl,
      generatedId,
      // @ts-ignore
      userId: context.userId,
      createdAt: new Date(),
      expireAt,
    });
  }
  await newUrl.save({ session });
  rateLimitSave(context, session).catch((e) => console.error(e));
  return alias;
}
