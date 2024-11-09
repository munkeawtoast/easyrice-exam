import { ListStandardApiSchema } from '@libs/dto/standard.dto';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { StandardService } from '../services/standard';

export default async function (fastify: FastifyInstance) {
  const standardService = new StandardService();
  fastify.withTypeProvider<ZodTypeProvider>().register(
    (instance) => {
      instance.route({
        method: 'GET',
        url: '/',
        schema: ListStandardApiSchema,
        handler: (request, reply) => {
          const result = standardService.queryRiceInspectionResult();
          return reply.code(200).send(result);
        },
      });
    },
    { prefix: '/standard' }
  );
}
