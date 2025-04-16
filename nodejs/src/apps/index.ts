import app from './http-handler';
import { mongo } from './mongo/init';
import { saveRedirect } from './analytics/saveRedirect';
import { generateURL } from './url-shortener/generateURL';

const start = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error('Invalid process.env.MONGO_URL');
  }
  await mongo.init(process.env.MONGO_URL);
  await Promise.all([
    saveRedirect.worker({}),
    generateURL.worker([0, 119163]),
    generateURL.worker([119164, 238326]),
  ]);
  await app.listen({ port: 3000 });
};

start().catch((e) => {
  app.log.error(e);
  process.exit(1);
});

process.stdin.resume();
