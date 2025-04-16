import app from './http-handler';
import { mongo } from './mongo/init';
import {saveRedirect} from "./analytics/saveRedirect";

const start = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error('Invalid process.env.MONGO_URL');
  }
  await mongo.init(process.env.MONGO_URL);
  await saveRedirect.worker();
  await app.listen({ port: 3000 });
};

start().catch((e) => {
  app.log.error(e);
  process.exit(1);
});

process.stdin.resume();
