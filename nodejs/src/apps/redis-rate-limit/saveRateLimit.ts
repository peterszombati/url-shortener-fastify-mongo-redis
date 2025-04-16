import { luaScript } from '../redis/luaScript';

// language=Lua
const script = `  local current = redis.call("INCR", KEYS[1] .. ":created")
  local lock = redis.call("DECR", KEYS[1] .. ":lock")
  if current == 1 then
    redis.call("EXPIRE", KEYS[1] .. ":created", 86400)
  end
  if lock == 1 then
    redis.call("EXPIRE", KEYS[1] .. ":lock", 30)
  end
  return 1`;

export const saveRateLimit = luaScript(script);
