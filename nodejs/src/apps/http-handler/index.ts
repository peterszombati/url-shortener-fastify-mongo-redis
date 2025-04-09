import Fastify from "fastify"
import {routes} from "./routes"
import CORS from '@fastify/cors'
import {ResponseError} from "./ResponseError"

declare module 'fastify' {
  interface FastifyRequest {
    context?: Record<string, any>
  }
}

const app = Fastify({logger: true})

app.register(CORS, {
  origin: (origin, cb) => {
    const allowedOrigins = ['http://localhost:3000']

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      cb(null, true)
    } else {
      cb(new Error('Not allowed by CORS'), false)
    }
  }
})

app.register((instance, _options, done) => {
  routes(instance)
    .then(() => done())
    .catch(e => done(e))
}, {prefix: ""})

app.setErrorHandler((error, request, reply) => {
  request.log.error(error)
  if (error instanceof ResponseError) {
    reply.status(error.statusCode || 200).send({
      status: {
        success: false,
        data: error.data,
        message: error.message,
      },
      result: error.result
    })
  } else {
    reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    })
  }
})

export default app