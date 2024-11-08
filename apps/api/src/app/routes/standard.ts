import { InspectionSamplingPointConditions } from '@libs/models';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';


const plugin: FastifyPluginAsyncZod = async function (fastify) {
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
};

export default plugin;
