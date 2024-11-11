import {
  DynamoDBClient,
  DynamoDBClientConfigType,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export type BaseQueryOptions = {
  limit: number;
};

export const createDynamodbClient = (options: DynamoDBClientConfigType) =>
  DynamoDBDocumentClient.from(
    new DynamoDBClient({
      ...options,
    }),
    {
      marshallOptions: {
        removeUndefinedValues: true,
      },
      unmarshallOptions: {},
    }
  );
