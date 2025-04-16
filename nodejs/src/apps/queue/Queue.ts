import { Queue as BullMQQueue, QueueEvents, Worker } from 'bullmq';
import { ConnectionOptions } from 'bullmq/dist/esm/interfaces/redis-options';

export const Queue = <A, B>(
  connection: ConnectionOptions,
  name: string,
  func: (params: A) => B,
): {
  add: (params: A) => Promise<void>;
  request: (params: A) => Promise<B>;
  queue: BullMQQueue;
  worker: () => Promise<void>;
} => {
  const queue = new BullMQQueue(name, { connection });
  const queueEvents = new QueueEvents(name, { connection });

  return {
    queue,
    worker: async () => {
      const w = new Worker(
        name,
        async (job) => {
          return func(job.data);
        },
        { connection },
      );
      await w.waitUntilReady();
    },
    add: async (params: A): Promise<void> => {
      await queue.add(name, params);
    },
    request: async (params: A): Promise<B> => {
      const job = await queue.add(name, params);
      await queueEvents.waitUntilReady();
      return await job.waitUntilFinished(queueEvents);
    },
  };
};
