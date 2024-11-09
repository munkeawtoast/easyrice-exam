import {
  BaseQueryOptions,
  IDdbRiceStandardDatabase,
  RiceStandardQueryOptions,
  ddbRiceStandardDatabase,
} from '@libs/database';
import { StandardDto } from '@libs/dto/standard.dto';
import { RiceStandard } from '@libs/models';

export type RiceInspectionResultKey = {
  id: string;
};

export class StandardService {
  private baseRiceKey = 'whiterice';
  constructor(
    private riceStandardDatabase: IDdbRiceStandardDatabase = ddbRiceStandardDatabase
  ) {}

  private transformToStandardDto(record: RiceStandard): StandardDto {
    return {
      name: record.name,
      id: record.id,
      createDate: record.createDate,
      standardName: record.standardName,
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
