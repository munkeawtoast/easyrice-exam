import { InspectionSamplingPointConditions } from '@libs/models';
import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const StandardDataSchema = z.object({
  key: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  shape: z.array(z.string()),
  name: z.string().optional(),
  conditionMin: z.nativeEnum(InspectionSamplingPointConditions),
  conditionMax: z.nativeEnum(InspectionSamplingPointConditions),
  value: z.number().optional(),
});

const HistoryResponseSchema = z.object({
  name: z.string().optional(),
  createDate: z.string().datetime().optional(),
  inspectionID: z.string().optional(),
  standardID: z.string().optional(),
  note: z.string().optional(),
  standardName: z.string().optional(),
  samplingDate: z.string().datetime().optional(),
  samplingPoint: z.array(z.string()).optional(),
  price: z.number().optional(),
  imageLink: z.string().optional(),
  standardData: z.array(StandardDataSchema),
});

const plugin: FastifyPluginAsync = async function (fastify) {
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
            200: HistoryListResponseSchema,
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
        handler: async (request, reply) => {
          // Implement your handler logic here
          return {
            standardData: [],
          };
        },
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
