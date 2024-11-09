import {
  BaseQueryOptions,
  IDdbRiceInspectionResultDatabase,
  RiceInspectionResultDatabaseGet,
  RiceInspectionResultQueryOptions,
  ddbRiceInspectionResultDatabase,
} from '@libs/database';
import { FullHistoryDto } from '@libs/dto/history.dto';

export type RiceInspectionResultKey = {
  id: string;
};

export class RiceInspectorService {
  private baseRiceKey = 'whiterice';
  constructor(
    private riceInspectionResultDatabase: IDdbRiceInspectionResultDatabase = ddbRiceInspectionResultDatabase
  ) {}

  async getRiceInspectionResult(
    query: RiceInspectionResultKey
  ): Promise<FullHistoryDto> {
    const record = await this.riceInspectionResultDatabase.get({
      id: query.id,
      type: this.baseRiceKey,
    });
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
    };
  }

  async queryRiceInspectionResult(options: RiceInspectionResultQueryOptions) {
    return this.riceInspectionResultDatabase.query(
      {
        type: this.baseRiceKey,
      },
      {
        ...options,
        limit: 50,
      }
    );
  }

  async createRiceInspectionResult(item: FullHistoryDto) {
    return this.riceInspectionResultDatabase.create({
      name: item.name,
      createDate: item.createDate,
      id: item.inspectionID,
      standardID: item.standardID,
      note: item.note,
      standardName: item.standardName,
      samplingDate: item.samplingDate,
      samplingPoint: item.samplingPoint,
      imageLink: item.imageLink,
      standardData: item.standardData,
      type: this.baseRiceKey,
    });
  }

  async deleteRiceInspectionResult(ids: string[]) {
    return this.riceInspectionResultDatabase.bulkDelete(
      ids.map((id) => ({ id, type: this.baseRiceKey }))
    );
  }
}
