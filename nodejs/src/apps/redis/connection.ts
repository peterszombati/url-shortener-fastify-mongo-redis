import IORedis from 'ioredis';

export const redis = {
  connection: new IORedis({ host: 'localhost', port: 6379, maxRetriesPerRequest: null }),
};
