import {saveRateLimit} from "../redis-rate-limit/saveRateLimit";

export function rateLimitSave(userId: string, date: Date) {
  return saveRateLimit.run([
    `redis-rate-limit:url-shortener:{${userId}}:${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`
  ])
}
