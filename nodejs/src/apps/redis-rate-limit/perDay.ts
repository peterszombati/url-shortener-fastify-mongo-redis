import { luaScript } from '../redis/luaScript';
import fs from "node:fs";
import path from "node:path";

const script = fs.readFileSync(path.join(__dirname, 'perDay.lua'), 'utf8');

export const perDay = luaScript(script);
