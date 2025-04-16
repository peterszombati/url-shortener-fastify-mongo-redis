import { redis } from './connection';

export function luaScript(script: string) {
  let scriptSha: string | undefined = undefined;

  const init = async () => {
    // @ts-ignore
    scriptSha = await redis.connection.script('LOAD', script);
    if (!scriptSha) {
      throw new Error('Failed to load script');
    }
  };
  return {
    init,
    run: async (keys: string[], ...args: (string | Buffer | number)[]) => {
      if (!scriptSha) {
        await init();
      }
      try {
        // @ts-ignore
        return await redis.connection.evalsha(scriptSha, keys.length, ...keys, ...args);
      } catch (e: any) {
        if (e?.message?.includes('NOSCRIPT')) {
          await init();
        } else {
          throw e
        }
        // @ts-ignore
        return redis.connection.evalsha(scriptSha, keys.length, ...keys, ...args);
      }
    },
  };
}
