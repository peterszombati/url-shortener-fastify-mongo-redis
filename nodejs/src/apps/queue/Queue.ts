import { Job, JobsOptions, Queue as BullMQQueue, QueueEvents, Worker, WorkerOptions } from 'bullmq';
import { ConnectionOptions } from 'bullmq/dist/esm/interfaces/redis-options';
import { toJSON } from '../utils/toJSON';
import { toInstance } from './toInstance';

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
          try {
            if (!job.name) {
              return [1, await func(job.data, params)];
            } else {
              return [
                0,
                {
                  name: 'Error',
                  data: { message: 'Unhandled' },
                },
              ];
            }
          } catch (e) {
            return [
              0,
              {
                name: Object.getPrototypeOf(e)?.constructor?.name,
                data: toJSON(e),
              },
            ];
          }
        },
        { connection, ...opts },
      );
      await w.waitUntilReady();
    },
    add: async (params: A, opts?: JobsOptions): Promise<void> => {
      await queue.add('', params, opts);
    },
    request: async (params: A, opts?: JobsOptions, ttl?: number): Promise<B> => {
      const job = await queue.add('', params, opts);
      await queueEvents.waitUntilReady();
      const [success, data] = await job.waitUntilFinished(queueEvents, ttl);
      if (success) {
        return data;
      }
      throw toInstance(data?.name, data.data);
    },
  };
};
