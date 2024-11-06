import { RiceInspectionResult } from '@libs/models';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BaseQueryInput } from './common.db';

export type RiceInspectionResultDatabasePk = Pick<RiceInspectionResult, 'type'>;
export type RiceInspectionResultDatabaseGet = Pick<
  RiceInspectionResult,
  'id' | 'type'
>;

export interface IDdbRiceInspectionResultDatabase {
  query: (
    query: RiceInspectionResultDatabasePk,
    options: BaseQueryInput
  ) => Promise<RiceInspectionResult[]>;
}

export class RiceInspectionResultDatabase
  implements IDdbRiceInspectionResultDatabase
{
  private ddbTable = 'easyrice-inspection_result';
  private dynamodbClient: DynamoDBDocumentClient;
  constructor() {
    this.dynamodbClient = DynamoDBDocumentClient.from(new DynamoDBClient(), {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
      },
      unmarshallOptions: {},
    });
  }
  async query(
    query: RiceInspectionResultDatabasePk,
    options: BaseQueryInput
  ): Promise<RiceInspectionResult[]> {
    const command = new QueryCommand({
      TableName: this.ddbTable,
      Limit: options?.limit ?? 50,
      ExpressionAttributeValues: {
        ':type': query.type,
      },
      KeyConditionExpression: 'type = :type',
    });
    const queryResult = await this.dynamodbClient.send(command);
    return queryResult.Items as RiceInspectionResult[];
  }

  async create(item: RiceInspectionResult) {
    const command = new PutCommand({
      TableName: this.ddbTable,
      Item: item,
    });
    return this.dynamodbClient.send(command);
  }

  async get(query: RiceInspectionResultDatabaseGet) {
    const command = new GetCommand({
      TableName: this.ddbTable,
      Key: {
        id: query.id,
        type: query.type,
      },
    });
    const getResult = await this.dynamodbClient.send(command);
    return getResult.Item;
  }
}
