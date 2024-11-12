import {
  BaseQueryOptions,
  IDdbRiceStandardDatabase,
  RiceStandardDatabase,
  RiceStandardQueryOptions,
} from '@libs/database';
import { StandardDto } from '@libs/dto/standard';
import { RiceStandard } from '@libs/models';
import { appConfig } from '../../config/app-config';

export type RiceInspectionResultKey = {
  id: string;
};

export class StandardService {
  private baseRiceKey = 'whiterice';
  private riceStandardDatabase: IDdbRiceStandardDatabase =
    new RiceStandardDatabase(appConfig().DDB_CLIENT);
  constructor() {}

  private transformToStandardDto(record: RiceStandard): StandardDto {
    return {
      id: record.id,
      createDate: record.createDate,
      standardName: record.name,
      standardData: record.standardData,
    };
  }

  async queryRiceInspectionResult(
    options?: RiceStandardQueryOptions & BaseQueryOptions
  ): Promise<StandardDto[]> {
    const records = await this.riceStandardDatabase.query(
      {
        type: this.baseRiceKey,
      },
      {
        ...options,
        limit: options?.limit ?? 50,
      }
    );
    return records.map(this.transformToStandardDto);
  }
}
