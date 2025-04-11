import {rateLimit} from "./rateLimit";
import {url} from "./db/url";
import {rateLimitSave} from "./rateLimitSave";
import {ClientSession} from "mongoose";

export async function saveURL({longUrl, alias, generatedId, userId, expireAt, session}: {
  longUrl: string,
  alias: string,
  generatedId?: number | undefined,
  userId: string
  expireAt: Date
  session: ClientSession | null
}) {
  await rateLimit(userId)

  const newUrl = new (url.model)({
    alias,
    longUrl,
    generatedId,
    userId,
    createdAt: new Date(),
    expireAt
  });

  await newUrl.save({session})
  rateLimitSave(userId, session).catch(e => console.error(e))
  return alias
}