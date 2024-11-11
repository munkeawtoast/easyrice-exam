import { createDynamodbClient } from '@libs/database';
import { cleanEnv, str } from 'envalid';

const cleanedEnv = cleanEnv(process.env, {
  LAMBDA_TASK_ROOT: str({
    default: '',
  }),
  // NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
});

const config = {
  IS_LAMBDA_ENVIRONMENT: !!cleanedEnv.LAMBDA_TASK_ROOT,
  DDB_CLIENT: createDynamodbClient({
    region: 'ap-southeast-1',
  }),
  // DDB_CLIENT: createDynamodbClient({
  //   credentials: !!cleanedEnv.LAMBDA_TASK_ROOT
  //     ? {
  //         accessKeyId: 'dummyKey123',
  //         secretAccessKey: 'dummyKey123',
  //       }
  //     : undefined,
  //   endpoint: !!cleanedEnv.LAMBDA_TASK_ROOT
  //     ? 'http://localhost:14578'
  //     : undefined,
  // }),
};

export const appConfig = () => config;
