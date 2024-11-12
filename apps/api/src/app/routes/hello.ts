import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().register(
    (instance) => {
      instance.route({
        method: 'GET',
        url: '/',
        handler: (request, reply) => {
          return reply.code(200).send({
            hello: 'world',
          });
        },
      });
      instance.route({
        method: 'POST',
        url: '/',
        handler: (request, reply) => {
          request.log.info('Request body:', request.body);
          return reply.code(200).send({
            body: request.body,
          });
        },
      });
    },
    { prefix: '/hello' }
  );
}
