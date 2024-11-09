import {
  GetHistoryApiSchema,
  GetHistoryResponseSchema,
  ListHistoryApiSchema,
} from '@libs/dto/history.dto';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { RiceInspectorService } from '../services/rice-inspector';

export default async function (fastify: FastifyInstance) {
  const riceInspectorService = new RiceInspectorService();
  fastify
    .withTypeProvider<ZodTypeProvider>()
    .register<any, any, ZodTypeProvider>(
      (route) => {
        route.route({
          method: 'GET',
          url: '/',
          schema: ListHistoryApiSchema,
          handler: async (request, reply) => {
            if (request.query.inspectionID) {
              const record = await riceInspectorService.getRiceInspectionResult(
                {
                  id: request.query.inspectionID,
                }
              );
              if (
                !record.createDate ||
                record.createDate < request.query.fromDate ||
                record.createDate > request.query.toDate
              ) {
                return {
                  data: [],
                };
              } else {
                return {
                  data: [record],
                };
              }
            } else {
              const records =
                await riceInspectorService.queryRiceInspectionResult({
                  fromDate: request.query.fromDate,
                  toDate: request.query.toDate,
                });
              return {
                data: records,
              };
            }
          },
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
