import {FastifyReply, FastifyRequest} from "fastify";
import {resolveUser} from "./resolveUser";

export const apiKeyAuthentication = {
  resolveUserMiddleware: async (request: FastifyRequest) => {
    const authorization = request.headers?.['authorization'];
    const userId = await resolveUser(authorization)

    if (userId) {
      if (!request.context) {
        request.context = {}
      }
      request.context["api-key-authentication"] = {userId}
    }
  },
  authMiddleware: async (request: FastifyRequest,  reply: FastifyReply) => {
    if (!request?.context?.["api-key-authentication"]?.userId) {
      return reply.status(401).send("Unauthorized")
    }
  }
}