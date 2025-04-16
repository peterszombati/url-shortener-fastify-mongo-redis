import { Job, JobsOptions, Queue as BullMQQueue, QueueEvents, Worker, WorkerOptions } from 'bullmq';
import { ConnectionOptions } from 'bullmq/dist/esm/interfaces/redis-options';

export const Queue = <A, B, C>(
  connection: ConnectionOptions,
  name: string,
  func: (params: A, worker: C) => B,
): {
  add: (params: A) => Promise<void>;
  request: (params: A) => Promise<B>;
  queue: BullMQQueue;
  worker: (params: C) => Promise<void>;
} => {
  const queue = new BullMQQueue(name, { connection });
  const queueEvents = new QueueEvents(name, { connection });

  return {
    queue,
    worker: async (params: C, opts?: WorkerOptions) => {
      const w = new Worker(
        name,
        async (job: Job) => {
          return func(job.data, params);
        },
        { connection, ...opts },
      );
      await w.waitUntilReady();
    },
    add: async (params: A, opts?: JobsOptions): Promise<void> => {
      await queue.add(name, params, opts);
    },
    request: async (params: A, opts?: JobsOptions, ttl?: number): Promise<B> => {
      const job = await queue.add(name, params, opts);
      await queueEvents.waitUntilReady();
      return await job.waitUntilFinished(queueEvents, ttl);
    },
  };
};
