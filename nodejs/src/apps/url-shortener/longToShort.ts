import {md5buffer} from "../crypto/md5buffer";
import {toBase62} from "../utils/toBase62";

export function longToShort(longUrl: string, index: number /* 0-238326*/): {
  generatedId: number
  shortened: string
} {
  if (index > 238326 || index < 0 || index % 1 != 0) {
    throw new Error("Invalid index")
  }
  const buffer = Array.from(md5buffer(longUrl))
  let generatedId = buffer.slice(0, 2).reduce((p, c, i) => p + c * Math.pow(256, i))
  const magic3622 = buffer.slice(2, 4).reduce((p, c, i) => p + c * Math.pow(256, i)) / 18093.594
  generatedId = Math.floor(magic3622 * generatedId)
  generatedId += index * 238329 // 238327*238329 = [61,61,61,61,61,61].reduce((a,b,i)=>a+b*Math.pow(62,i))
  const shortenString = toBase62(generatedId)
  return {
    generatedId,
    shortened: '0'.repeat(Math.max(0, 6 - shortenString.length)) + shortenString,
  }
}