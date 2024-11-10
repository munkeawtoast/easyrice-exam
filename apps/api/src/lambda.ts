import { awsLambdaFastify } from '@fastify/aws-lambda';
import server from './main';
const proxy = awsLambdaFastify(server);
// or
// const proxy = awsLambdaFastify(app, { binaryMimeTypes: ['application/octet-stream'], serializeLambdaArguments: false /* default is true */ })

export const handler = proxy;
