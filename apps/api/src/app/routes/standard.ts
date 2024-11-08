import { ListStandardApiSchema } from '@libs/dto/standard.dto';
import { InspectionSamplingPointConditions } from '@libs/models';
import { FastifyInstance } from 'fastify';
import {
  FastifyPluginAsyncZod,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().register(
    (instance) => {
      instance.route({
        method: 'GET',
        url: '/',
        schema: ListStandardApiSchema,
        handler: (req, res) => {},
      });
    },
    { prefix: '/standard' }
  );
}
