// import type { InspectionSamplingPointConditions } from '@libs/models';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const plugin: FastifyPluginAsyncZod = async function (fastify) {
  fastify.register(
    (instance) => {
      instance.route({
        method: 'GET',
        url: '/',
        // Define your schema
        schema: {
          querystring: z.object({
            fromDate: z.string().datetime(),
            toDate: z.string().datetime(),
            inspectionID: z.string(),
          }),
        },
        handler: (req, res) => {
          return {
            hello: 'world',
          };
        },
      });
    },
    {
      prefix: '/history',
    }
  );
};

export default plugin;
