import { ListStandardApiSchema } from '@libs/dto/standard.dto';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { StandardService } from '../services/standard';

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
    },
    { prefix: '/hello' }
  );
}
