import { luaScript } from "../redis/luaScript";

const script = `  local current = redis.call("INCR", KEYS[1] .. ":lock")
  local created = redis.call("GET", KEYS[1] .. ":created")
  if current == 1 then
    redis.call("EXPIRE", KEYS[1] .. ":lock", 30)
  end
  if created then
    current = current + tonumber(created)
  end
  if current > tonumber(ARGV[1]) then
    return 0
  end
  return 1`;

export const perDay = luaScript(script)