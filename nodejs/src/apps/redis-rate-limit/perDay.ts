import { luaScript } from '../redis/luaScript';

// language=Lua
const script = `  local limit = tonumber(ARGV[1])
  local created = tonumber(redis.call("GET", KEYS[1] .. ":created"))
  if created and created >= limit then
    return 0
  end
  local current = redis.call("INCR", KEYS[1] .. ":lock")
  redis.call("EXPIRE", KEYS[1] .. ":lock", 30)
  if created then
    current = current + created
  end
  if current > limit then
    return 0
  end
  return 1`;

export const perDay = luaScript(script);
