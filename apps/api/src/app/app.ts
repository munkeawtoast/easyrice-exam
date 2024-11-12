import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { fastifyMultipart } from '@fastify/multipart';
import fp from './plugins/sensible';
import historyRoute from './routes/history';
import standardRoute from './routes/standard';
import helloRoute from './routes/hello';

import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

/* eslint-disable-next-line */
export interface AppOptions {}

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  // fastify.register(AutoLoad, {
  //   dir: path.join(__dirname, 'plugins'),
  //   options: { ...opts },
  // });
  fastify.register(cors, {
    origin: ['http://localhost:4200'],
  });

  fastify.register(fp);
  fastify.register(historyRoute);
  fastify.register(helloRoute);
  fastify.register(standardRoute);
  fastify.setErrorHandler(function (error, request, reply) {
    // Log error
    this.log.error(error);
    this.log.error(request);
    // Send error response
    reply.status(409).send({ ok: false });
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  // fastify.register(AutoLoad, {
  //   dir: path.join(__dirname, 'routes'),
  //   options: { ...opts },
  // });
}
