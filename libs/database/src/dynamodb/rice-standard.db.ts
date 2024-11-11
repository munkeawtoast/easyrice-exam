import { RiceStandard } from '@libs/models';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { BaseQueryOptions } from './common.db';

export type RiceStandardDatabaseQueryArgs = Pick<RiceStandard, 'type'>;
export type RiceStandardDatabaseGetArgs = Pick<RiceStandard, 'id' | 'type'>;

export interface IDdbRiceStandardDatabase {
  query: (
    keys: RiceStandardDatabaseQueryArgs,
    options: BaseQueryOptions
  ) => Promise<RiceStandard[]>;
}

export type RiceStandardQueryOptions = {};

export class RiceStandardDatabase implements IDdbRiceStandardDatabase {
  private ddbTable = 'easyrice-standard';
  constructor(private dynamodbClient: DynamoDBDocumentClient) {}

  async query(
    keys: RiceStandardDatabaseQueryArgs,
    options: BaseQueryOptions
  ): Promise<RiceStandard[]> {
    const command = new QueryCommand({
      TableName: this.ddbTable,
      Limit: options?.limit ?? 50,
      ExpressionAttributeValues: {
        ':type': keys.type,
      },
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      KeyConditionExpression: '#type = :type',
    });
    const a = await this.dynamodbClient.send(command);
    return a.Items as RiceStandard[];
  }
}
