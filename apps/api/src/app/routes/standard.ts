import { InspectionSamplingPointConditions } from '@libs/models';
import { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

export default async function (fastify: FastifyInstance) {
  fastify.register(
    (instance) => {
      instance.route({
        method: 'GET',
        url: '/',
        schema: {
          querystring: z.object({
            name: z.string().min(4),
          }),
          response: {
            200: responseSchema,
          },
        },
        handler: (req, res) => {},
      });
    },
    { prefix: '/standard' }
  );
}
