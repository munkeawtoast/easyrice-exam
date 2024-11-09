import {
  GetHistoryApiSchema,
  GetHistoryResponseSchema,
  ListHistoryApiSchema,
  ListHistoryResopnseDto,
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
            const result: ListHistoryResopnseDto['data'] = [];
            if (request.query.inspectionID) {
              const {
                standardData: _,
                imageLink: __,
                ...record
              } = await riceInspectorService.getRiceInspectionResult({
                id: request.query.inspectionID,
              });
              if (
                !record.createDate ||
                record.createDate < request.query.fromDate ||
                record.createDate > request.query.toDate
              ) {
              } else {
                result.push(record);
              }
            } else {
              const records =
                await riceInspectorService.queryRiceInspectionResult({
                  fromDate: request.query.fromDate,
                  toDate: request.query.toDate,
                });
              result.push(...records);
            }
            return reply.code(200).send({ data: result });
          },
        });

        route.route({
          method: 'GET',
          url: '/:id',
          schema: GetHistoryApiSchema,
          handler: async (request, reply) => {
            const record = await riceInspectorService.getRiceInspectionResult({
              id: request.params.id,
            });
            return reply.code(200).send(record);
          },
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
            await riceInspectorService.createRiceInspectionResult(request.body);
            return reply.code(201).send(request.body);
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
            await riceInspectorService.deleteRiceInspectionResult(
              request.body.inspectionID
            );
            return reply.code(200).send('success');
          },
        });
      },
      { prefix: '/history' }
    );
}
