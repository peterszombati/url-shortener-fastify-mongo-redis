import { FastifyInstance, FastifyRequest } from 'fastify';
import { resolveURL } from '../url-shortener/resolveURL';
import { apiKeyAuthentication as auth } from '../api-key-authentication/middleware';
import { ResponseError } from './ResponseError';
import { handleAnalytics } from '../analytics/handleAnalytics';
import { createCustomURL } from '../url-shortener/createCustomURL';
import { generateURL } from '../url-shortener/generateURL';

export const routes = async (app: FastifyInstance) => {
  app.post<{
    Body: { originalUrl?: string; expiresAt?: string; customAlias?: string };
  }>('/shorten', { preHandler: [auth.resolveUserMiddleware, auth.authMiddleware] }, async (req) => {
    if (!req.body.originalUrl || typeof req.body.originalUrl != 'string') {
      throw new ResponseError({ statusCode: 400, message: 'invalid request body' });
    }
    if (req.body.expiresAt) {
      if (isNaN(new Date(req.body.expiresAt).getTime())) {
        throw new ResponseError({ statusCode: 400, message: 'invalid request body' });
      }
      if (new Date(req.body.expiresAt).getTime() < new Date().getTime()) {
        throw new ResponseError({ statusCode: 400, message: 'expireAt is expired' });
      }
    }
    if (req.body.customAlias) {
      if (typeof req.body.customAlias != 'string') {
        throw new ResponseError({ statusCode: 400, message: 'invalid request body' });
      }
    }

    let alias;
    if (req.body.customAlias) {
      alias = await createCustomURL(
        req.body.originalUrl as string,
        req.context?.['api-key-authentication'].userId,
        {
          expireAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
          customAlias: req.body.customAlias,
        },
      );
    } else {
      alias = await generateURL(
        req.body.originalUrl as string,
        req.context?.['api-key-authentication'].userId,
        {
          expireAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
        },
      );
    }

    return { shortUrl: 'http://localhost:3000/' + alias };
  });
  /*
  curl -X POST http://127.0.0.1:3000/shorten \
   -H "Content-Type: application/json" \
   -H 'Authorization: Api-Key admin:f13aaa6528c7be63b74cf8df514d3a4cc5776caec4b76bc5ee294c981e05f90e' \
   -d '{"originalUrl": "https://facebook.com", "customAlias": "optionalAlias"}'
  */
  /*
curl -X POST http://127.0.0.1:3000/shorten \
-H "Content-Type: application/json" \
-H 'Authorization: Api-Key admin:f13aaa6528c7be63b74cf8df514d3a4cc5776caec4b76bc5ee294c981e05f90e' \
-d '{"originalUrl": "https://facebook.com", "expiresAt": "2024-12-31T23:59:59Z"}'
*/
  app.get('/analytics/:alias', async (request: FastifyRequest, _reply) => {
    const { alias } = request.params as Record<string, string>;
    return await handleAnalytics(alias);
  });
  app.get('/:alias', async (request: FastifyRequest, reply) => {
    const { alias } = request.params as Record<string, string>;

    const longUrl = await resolveURL(alias);
    if (longUrl) {
      return reply.redirect(longUrl);
    }
    return reply.status(404).send('Not Found');
  });
};
