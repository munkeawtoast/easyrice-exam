import {
  GetHistoryApiSchema,
  GetHistoryResponseSchema,
  ListHistoryApiSchema,
} from '@libs/dto/history.dto';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import type { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register<any, any, ZodTypeProvider>(
      (route) => {
        route.route({
          method: 'GET',
          url: '/',
          schema: ListHistoryApiSchema,
          handler: async (request, reply) => {},
        });

        route.route({
          method: 'GET',
          url: '/:id',
          schema: GetHistoryApiSchema,
          handler: async (request, reply) => {},
        });

        route.route({
          method: 'POST',
          url: '/',
          schema: {
            body: GetHistoryResponseSchema,
            response: {
              200: GetHistoryResponseSchema,
            },
          },
          handler: async (request, reply) => {
            // Implement your handler logic here
            return request.body;
          },
        });

        route.route({
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
}
