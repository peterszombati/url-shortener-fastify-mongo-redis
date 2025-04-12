import { FastifyReply, FastifyRequest } from 'fastify';
import { resolveUser } from './resolveUser';

export const apiKeyAuthentication = {
  resolveUser: async (request: FastifyRequest) => {
    const authorization = request.headers?.['authorization'];
    const userId = await resolveUser(authorization);

    if (userId) {
      if (!request.context) {
        request.context = {};
      }
      request.context.userId = userId;
    }
  },
  auth: async (request: FastifyRequest, reply: FastifyReply) => {
    if (request?.context?.userId === undefined) {
      return reply.status(401).send('Unauthorized');
    }
  },
};
