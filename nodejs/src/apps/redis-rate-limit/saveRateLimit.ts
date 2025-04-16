import { luaScript } from '../redis/luaScript';
import * as path from "node:path";
import * as fs from "node:fs";

const script = fs.readFileSync(path.join(__dirname, 'saveRateLimit.lua'), 'utf8');

export const saveRateLimit = luaScript(script);
