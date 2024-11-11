import {
  CreateRiceInspectionResultDatabasePk,
  IDdbRiceInspectionResultDatabase,
  RiceInspectionResultDatabase,
  RiceInspectionResultDatabaseGet,
  RiceInspectionResultQueryOptions,
} from '@libs/database';
import {
  CreateHistoryRequestBody,
  FullHistoryDto,
  HistoryDto,
  PutHistoryParams,
  PutHistoryRequestBody,
} from '@libs/dto/history.dto';
import { RiceInspectionResult } from '@libs/models';
import { randomUUID } from 'crypto';
import { appConfig } from '../../config/app-config';

export type RiceInspectionResultKey = {
  id: string;
};

export class RiceInspectorService {
  private baseRiceKey = 'whiterice';
  private riceInspectionResultDatabase: IDdbRiceInspectionResultDatabase =
    new RiceInspectionResultDatabase(appConfig().DDB_CLIENT);
  constructor() {}

  private transformToHistoryDto(record: RiceInspectionResult): HistoryDto {
    return {
      name: record.name,
      createDate: record.createDate,
      inspectionID: record.id,
      standardID: record.standardID,
      note: record.note,
      standardName: record.standardName,
      samplingDate: record.samplingDate,
      samplingPoint: record.samplingPoint,
    };
  }

  private transformToFullHistoryDto(
    record: RiceInspectionResult
  ): FullHistoryDto {
    return {
      name: record.name,
      createDate: record.createDate,
      inspectionID: record.id,
      standardID: record.standardID,
      note: record.note,
      standardName: record.standardName,
      samplingDate: record.samplingDate,
      samplingPoint: record.samplingPoint,
      imageLink: record.imageLink,
      standardData: record.standardData,
      riceTypePercentage: record.riceTypePercentage,
    };
  }

  async getRiceInspectionResult(
    query: RiceInspectionResultKey
  ): Promise<FullHistoryDto> {
    const record = await this.riceInspectionResultDatabase.get({
      id: query.id,
      type: this.baseRiceKey,
    });
    return this.transformToFullHistoryDto(record);
  }

  async queryRiceInspectionResult(
    options: RiceInspectionResultQueryOptions
  ): Promise<HistoryDto[]> {
    const records = await this.riceInspectionResultDatabase.query(
      {
        type: this.baseRiceKey,
      },
      {
        ...options,
        limit: 50,
      }
    );
    return records.map(this.transformToHistoryDto);
  }

  async putRiceInspectionResult(
    item: PutHistoryParams & PutHistoryRequestBody
  ): Promise<FullHistoryDto> {
    const creatingItem: PutHistoryRequestBody = {
      note: item.note,
      samplingDate: item.samplingDate,
      samplingPoint: item.samplingPoint,
    };
    const key: RiceInspectionResultDatabaseGet = {
      id: item.inspectionID,
      type: this.baseRiceKey,
    };
    const record = await this.riceInspectionResultDatabase.update(
      key,
      creatingItem
    );
    return this.transformToFullHistoryDto(record);
  }

  async createRiceInspectionResult(
    item: CreateHistoryRequestBody
  ): Promise<FullHistoryDto> {
    const creatingItem = {
      name: item.name ?? '',
      createDate: item.createDate,
      id: randomUUID(),
      standardID: item.standardID,
      note: item.note,
      standardName: item.standardName,
      samplingDate: item.samplingDate,
      samplingPoint: item.samplingPoint,
      imageLink: item.imageLink,
      standardData: item.standardData,
      price: item.price,
      type: this.baseRiceKey,
      riceTypePercentage: item.riceTypePercentage,
    } satisfies CreateRiceInspectionResultDatabasePk;

    await this.riceInspectionResultDatabase.create(creatingItem);
    return this.transformToFullHistoryDto(creatingItem);
  }

  async deleteRiceInspectionResult(ids: string[]): Promise<void> {
    return this.riceInspectionResultDatabase.bulkDelete(
      ids.map((id) => ({ id, type: this.baseRiceKey }))
    );
  }
}
