import {url} from "./db/url";
import {ResponseError} from "../http-handler/ResponseError";

export const generateUniqueId = async (id?: number): Promise<number> => {
  let exists = true
  let uniqueId = id;
  let tried = 0;

  if (id !== undefined) {
    for (let i = 1; i < 4 && exists; i++) {
      uniqueId = id + i;
      exists = await url.model.countDocuments({generatedId: uniqueId}) > 0;
      tried += 1;
    }
  }

  while (exists) {
    if (tried > 20) {
      throw new ResponseError({
        statusCode: 500,
        message: "Failed to get after 20 try"
      })
    }
    uniqueId = Math.floor(Math.random() * 1000000 * Math.random() * 56800);
    exists = await url.model.countDocuments({ generatedId: uniqueId }) > 0;
    tried += 1
  }

  if (uniqueId === undefined) {
    throw new Error("Failed to get uniqueId")
  }

  return uniqueId;
}