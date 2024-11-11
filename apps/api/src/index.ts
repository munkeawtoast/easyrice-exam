import Fastify from 'fastify';
import { app } from './app/app';
import { awsLambdaFastify } from '@fastify/aws-lambda';
import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
  Context,
} from 'aws-lambda';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const isLambda = !!process.env.LAMBDA_TASK_ROOT;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
  ignoreTrailingSlash: true,
});
let handler;

// Register your application as a normal plugin.
server.register(app);

if (!isLambda) {
  server.listen({ port, host }, (err) => {
    if (err) {
      server.log.error(err);
      process.exit(1);
    } else {
      console.log(`[ ready ] http://${host}:${port}`);
    }
  });
} else {
  const proxy = awsLambdaFastify(server);
  handler = (event: APIGatewayProxyEvent, context: Context) => {
    // console.dir(event, { depth: null });
    return proxy(event, context);
  };
}

export { handler };
