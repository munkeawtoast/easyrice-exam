import { RiceStandard } from '@libs/models';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { BaseQueryInput } from './common.db';

export type RiceStandardDatabaseQueryArgs = Pick<RiceStandard, 'type'>;
export type RiceStandardDatabaseGetArgs = Pick<RiceStandard, 'id' | 'type'>;

export interface IDdbRiceStandardDatabase {
  query: (
    keys: RiceStandardDatabaseQueryArgs,
    options: BaseQueryInput
  ) => Promise<RiceStandard[]>;
}

export class RiceStandardDatabase implements IDdbRiceStandardDatabase {
  private ddbTable = 'easyrice-standard';
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
    keys: RiceStandardDatabaseQueryArgs,
    options: BaseQueryInput
  ): Promise<RiceStandard[]> {
    const command = new QueryCommand({
      TableName: this.ddbTable,
      Limit: options?.limit ?? 50,
      ExpressionAttributeValues: {
        ':type': { S: keys.type },
      },
      KeyConditionExpression: 'type = :type',
    });
    const a = await this.dynamodbClient.send(command);
    return a.Items as RiceStandard[];
  }
}
