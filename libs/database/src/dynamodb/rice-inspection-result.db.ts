import { RiceInspectionResult } from '@libs/models';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { BaseQueryOptions } from './common.db';
import { randomUUID } from 'crypto';
import { Prettify } from 'ts-essentials';

export type RiceInspectionResultDatabasePk = Pick<RiceInspectionResult, 'type'>;
export type RiceInspectionResultDatabaseGet = Pick<
  RiceInspectionResult,
  'id' | 'type'
>;

export type CreateRiceInspectionResultDatabasePk = Omit<
  RiceInspectionResult,
  'id' | 'createDate'
> & { id?: string; createDate?: string };

export type RiceInspectionResultQueryOptions = {
  fromDate?: string;
  toDate?: string;
};
export interface IDdbRiceInspectionResultDatabase {
  query: (
    query: RiceInspectionResultDatabasePk,
    options: RiceInspectionResultQueryOptions & BaseQueryOptions
  ) => Promise<RiceInspectionResult[]>;
  get: (
    query: RiceInspectionResultDatabaseGet
  ) => Promise<RiceInspectionResult>;
  create: (item: CreateRiceInspectionResultDatabasePk) => Promise<void>;
  update: (
    key: RiceInspectionResultDatabaseGet,
    item: Prettify<Partial<Omit<RiceInspectionResult, 'id' | 'type'>>>
  ) => Promise<RiceInspectionResult>;
  bulkDelete: (keys: RiceInspectionResultDatabaseGet[]) => Promise<void>;
}

export class RiceInspectionResultDatabase
  implements IDdbRiceInspectionResultDatabase
{
  private ddbTable = 'easyrice-inspection_result';
  constructor(private dynamodbClient: DynamoDBDocumentClient) {}

  private createUpdateExpressions(item: { [key: string]: any }) {
    const updateExpression: string[] = [];
    const expressionAttribute: { [key: string]: any } = {};
    const expressionAttributeNames: { [key: string]: any } = {};
    Object.keys(item).map((key) => {
      const placeholder = `:${key}`;
      const alias = `#${key}`;
      updateExpression.push(`${alias} = ${placeholder}`);
      expressionAttribute[placeholder] = item[key];
      expressionAttributeNames[alias] = key;
    });
    return { updateExpression, expressionAttribute, expressionAttributeNames };
  }

  async query(
    query: RiceInspectionResultDatabasePk,
    options: BaseQueryOptions & RiceInspectionResultQueryOptions
  ): Promise<RiceInspectionResult[]> {
    let condition = '#type = :type';

    if (options.fromDate && options.toDate) {
      condition += ' AND createDate BETWEEN :fromDate AND :toDate';
    } else if (options.fromDate) {
      condition += ' AND createDate >= :fromDate';
    } else if (options.toDate) {
      condition += ' AND createDate <= :toDate';
    }
    const command = new QueryCommand({
      TableName: this.ddbTable,
      Limit: options?.limit ?? 50,
      ExpressionAttributeValues: {
        ':type': query.type,
        ':fromDate': options?.fromDate,
        ':toDate': options?.toDate,
      },
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      KeyConditionExpression: condition,
    });
    const queryResult = await this.dynamodbClient.send(command);
    return queryResult.Items as RiceInspectionResult[];
  }

  async update(
    key: RiceInspectionResultDatabaseGet,
    item: Prettify<Partial<Omit<RiceInspectionResult, 'id' | 'type'>>>
  ) {
    const { updateExpression, expressionAttribute, expressionAttributeNames } =
      this.createUpdateExpressions(item);
    const command = new UpdateCommand({
      TableName: this.ddbTable,
      Key: key,
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttribute,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    });
    const response = await this.dynamodbClient.send(command);
    return response.Attributes as RiceInspectionResult;
  }

  async create(item: CreateRiceInspectionResultDatabasePk) {
    const creatingItem = {
      ...item,
      id: item.id ?? randomUUID(),
      createDate: item.createDate ?? new Date().toISOString(),
    } satisfies RiceInspectionResult;

    console.log('db', creatingItem.price);

    const command = new PutCommand({
      TableName: this.ddbTable,
      Item: creatingItem,
    });
    await this.dynamodbClient.send(command);
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
    return getResult.Item as RiceInspectionResult;
  }

  async bulkDelete(keys: RiceInspectionResultDatabaseGet[]) {
    const command = new TransactWriteCommand({
      TransactItems: keys.map((key) => ({
        Delete: {
          TableName: this.ddbTable,
          Key: key,
        },
      })),
    });
    await this.dynamodbClient.send(command);
  }
}
