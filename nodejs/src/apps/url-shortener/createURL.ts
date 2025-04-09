import {longToShort} from "./longToShort";
import {saveURL} from "./saveURL";
import {fromBase62ToNumber} from "../utils/fromBase62ToNumber";
import {ResponseError} from "../http-handler/ResponseError";
import {mongoTransaction} from "../mongo/mongoTransaction";

const SEVEN_DAYS_IN_MS = 604800000

export async function createURL(longUrl: string, userId: string, {customAlias, expireAt}: {
  customAlias?: string,
  expireAt?: Date
} = {}) {
  if (expireAt) {
    if (expireAt.getTime() < new Date().getTime()) {
      throw new ResponseError({statusCode: 400, message: "expireAt is expired"})
    }
  }
  return await mongoTransaction(async (session) => {
    if (customAlias) {
      const generatedId = customAlias.match(/^[a-zA-Z0-9]{6}$/g) ? fromBase62ToNumber(customAlias) : undefined
      return await saveURL({
        longUrl,
        alias: customAlias,
        generatedId,
        userId,
        tryOtherId: false,
        expireAt: expireAt || new Date(new Date().getTime() + SEVEN_DAYS_IN_MS),
        session
      })
    } else {
      const {generatedId, shortened} = longToShort(longUrl, Math.floor(Math.random() * 238326))
      return await saveURL({
        longUrl,
        alias: shortened,
        generatedId,
        userId,
        tryOtherId: true,
        expireAt: expireAt || new Date(new Date().getTime() + SEVEN_DAYS_IN_MS),
        session
      })
    }
  })
}