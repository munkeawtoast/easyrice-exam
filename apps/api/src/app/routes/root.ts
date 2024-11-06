import { FastifyInstance } from 'fastify';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

const plugin: FastifyPluginAsyncZod = async function (fastify, _opts) {
  fastify.route({
    method: 'GET',
    url: '/',
    // Define your schema
    schema: {
      querystring: z.object({
        name: z.string().min(4),
      }),
      response: {
        200: z.object({ henlo: z.string() }),
      },
    },
    handler: (req, res) => {
      return { henlo: req.query.name };
    },
  });
};

export default plugin;
