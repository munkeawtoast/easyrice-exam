import { InspectionSamplingPointConditions } from '@libs/models';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const responseSchema = z.object({
  name: z.string(),
  id: z.string(),
  createDate: z.string().datetime(),
  standardName: z.string(),
  standardData: z.array(
    z.object({
      key: z.string(),
      minLength: z.number().nonnegative(),
      maxLength: z.number().nonnegative(),
      shape: z.array(z.string()),
      name: z.string(),
      conditionMin: z.nativeEnum(InspectionSamplingPointConditions),
      conditionMax: z.nativeEnum(InspectionSamplingPointConditions),
    })
  ),
});

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
