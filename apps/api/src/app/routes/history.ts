import { InspectionSamplingPointConditions } from '@libs/models';
import {
  HistoryListResponseDtoSchema,
  HistoryResponseSchema,
} from '@libs/dto/history.dto';
import { z } from 'zod';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const plugin: FastifyPluginAsyncZod = async function (fastify) {
  fastify.register(
    (instance) => {
      // GET /history
      instance.route({
        method: 'GET',
        url: '/',
        schema: {
          querystring: z.object({
            fromDate: z.string().datetime(),
            toDate: z.string().datetime(),
            inspectionID: z.string(),
          }),
          response: {
            200: HistoryListResponseDtoSchema,
          },
        },
        handler: async (request, reply) => {
          // Implement your handler logic here
          return { data: [] };
        },
      });

      // GET /history/:id
      instance.route({
        method: 'GET',
        url: '/:id',
        schema: {
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: HistoryResponseSchema,
          },
        },
        handler: async (request, reply) => {},
      });

      // POST /history
      instance.route({
        method: 'POST',
        url: '/',
        schema: {
          body: HistoryResponseSchema,
          response: {
            200: HistoryResponseSchema,
          },
        },
        handler: async (request, reply) => {
          // Implement your handler logic here
          return request.body;
        },
      });

      // DELETE /history
      instance.route({
        method: 'DELETE',
        url: '/',
        schema: {
          body: z.object({
            inspectionID: z.array(z.string()),
          }),
          response: {
            200: z.string(),
          },
        },
        handler: async (request, reply) => {
          // Implement your handler logic here
          return 'Success';
        },
      });
    },
    { prefix: '/history' }
  );
};

export default plugin;
