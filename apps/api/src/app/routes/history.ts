import {
  CreateHistoryApiSchema,
  DeleteHistoryApiSchema,
  FullHistoryDtoSchema,
  FullHistoryDto,
  GetHistoryApiSchema,
  ListHistoryApiSchema,
  ListHistoryResopnseDto,
  PutHistoryApiSchema,
} from '@libs/dto/history';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import type { FastifyInstance } from 'fastify';
import { RiceInspectorService } from '../services/rice-inspector';
import { RiceRawAnalysis, RiceRawAnalysisSchema } from '@libs/models';

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
              try {
                const {
                  standardData: _,
                  imageLink: __,
                  ...record
                } = await riceInspectorService.getRiceInspectionResult({
                  id: request.query.inspectionID,
                });
                result.push(record);
              } catch (e) {}
            } else {
              try {
                const records =
                  await riceInspectorService.queryRiceInspectionResult({
                    fromDate: request.query.fromDate,
                    toDate: request.query.toDate,
                  });
                result.push(...records);
              } catch (e) {
                console.error(e);
                return reply.code(500).send('Internal Server Error');
              }
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
          schema: CreateHistoryApiSchema,
          handler: async (request, reply) => {
            const history =
              await riceInspectorService.createRiceInspectionResult(
                request.body
              );
            return reply.code(201).send(history as FullHistoryDto);
          },
        });

        route.route({
          method: 'PUT',
          url: '/',
          schema: PutHistoryApiSchema,
          handler: async (request, reply) => {
            const newHistory =
              await riceInspectorService.putRiceInspectionResult({
                ...request.body,
                ...request.params,
              });
            return reply.code(200).send(newHistory);
          },
        });

        route.route({
          method: 'DELETE',
          url: '/',
          schema: DeleteHistoryApiSchema,
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
