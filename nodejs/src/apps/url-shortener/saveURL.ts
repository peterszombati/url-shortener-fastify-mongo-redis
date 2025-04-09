import {rateLimit} from "./rateLimit";
import {url} from "./db/url";
import {generateUniqueId} from "./generateUniqueId";
import {toBase62} from "../utils/toBase62";
import {rateLimitSave} from "./rateLimitSave";
import {ResponseError} from "../http-handler/ResponseError";
import {ClientSession} from "mongoose";

export async function saveURL({longUrl, alias, generatedId, tryOtherId, userId, expireAt, session}: {
  longUrl: string,
  alias: string,
  generatedId?: number | undefined,
  tryOtherId: boolean
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

  try {
    await newUrl.save({session})
    rateLimitSave(userId, session).catch(e => console.error(e))
    return alias
  } catch (e: any) {
    if (e.code !== 11000) {
      throw e
    }
    if (!tryOtherId) {
      throw new ResponseError({
        statusCode: 406,
        message: "Alias already exists"
      })
    }

    const id = await generateUniqueId(generatedId)
    return saveURL({longUrl, alias: toBase62(id), generatedId: id, tryOtherId, userId, expireAt, session})
  }
}