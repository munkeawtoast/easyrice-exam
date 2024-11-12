import {
  CreateRiceInspectionResultDatabasePk,
  IDdbRiceInspectionResultDatabase,
  RiceInspectionResultDatabase,
  RiceInspectionResultDatabaseGet,
  RiceInspectionResultQueryOptions,
} from '@libs/database';
import {
  FullHistoryDto,
  HistoryDto,
  PutHistoryParams,
  PutHistoryRequestBody,
} from '@libs/dto/history';
import {
  InspectionSamplingPointConditions,
  RiceInspectionResult,
  RiceInspectionSubStandard,
  RiceRawAnalysis,
} from '@libs/models';
import { randomUUID } from 'crypto';
import { appConfig } from '../../config/app-config';
import { basicRawRiceAnalysisData } from '../data/raw-rice-analysis';
import { SubStandardData } from '@libs/dto/standard';

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
    console.log(record);
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

  private operator(
    condition: InspectionSamplingPointConditions,
    value1: number,
    value2: number
  ) {
    switch (condition) {
      case InspectionSamplingPointConditions.GE:
        return value1 >= value2;
      case InspectionSamplingPointConditions.GT:
        return value1 > value2;
      case InspectionSamplingPointConditions.LE:
        return value1 <= value2;
      case InspectionSamplingPointConditions.LT:
        return value1 < value2;
      default:
        return false;
    }
  }

  private analyzeRiceTypePercentage(
    standardData: SubStandardData[],
    rawData: RiceRawAnalysis
  ) {
    const defectCountMap = new Map();
    const compositionCountMap = new Map();
    rawData.grains.forEach((grain) => {
      // analyze defects
      defectCountMap.set(grain.type, (defectCountMap.get(grain.type) ?? 0) + 1);

      const grainShape = standardData
        .map((standard) => {
          // return undefined if not satisfy
          if (standard.shape.includes(grain.shape)) {
            if (
              this.operator(
                standard.conditionMin,
                grain.length,
                standard.minLength
              ) &&
              this.operator(
                standard.conditionMax,
                grain.length,
                standard.maxLength
              )
            ) {
              return standard.key;
            }
          }
        })
        // filter only the satisfied standard and pick the first one
        .filter((a) => a)[0];

      if (grainShape === undefined) {
        compositionCountMap.set(
          'unknown',
          (compositionCountMap.get('unknown') ?? 0) + 1
        );
      } else {
        compositionCountMap.set(
          grainShape,
          (compositionCountMap.get(grainShape) ?? 0) + 1
        );
      }
    });
    const grainsCount = rawData.grains.length;
    const composition: Record<string, number> = {};
    const defect: Record<string, number> = {};
    defectCountMap.forEach((count, riceType) => {
      console.log('first', riceType, count);
      const percentage = (count / grainsCount) * 100;
      defect[riceType] = percentage;
    });

    compositionCountMap.forEach((count, shape) => {
      const percentage = (count / grainsCount) * 100;
      composition[shape] = percentage;
    });

    return {
      defect,
      composition,
    };
  }

  async createRiceInspectionResult(item: {
    standardID: string;
    standardName: string;
    samplingDate?: string;
    standardData: SubStandardData[];
    rawData?: RiceRawAnalysis;
    name: string;
    createDate?: string;
    note?: string;
    samplingPoint: string[];
    price?: number;
  }): Promise<FullHistoryDto> {
    let rawRiceAnalysis: RiceRawAnalysis;
    if (!item.rawData) {
      rawRiceAnalysis = basicRawRiceAnalysisData;
    } else {
      rawRiceAnalysis = item.rawData;
    }

    const { composition, defect } = this.analyzeRiceTypePercentage(
      item.standardData,
      rawRiceAnalysis
    );
    const standardData = Object.entries(composition).map(
      ([key, value]) =>
        ({
          ...item.standardData.find((standard) => standard.key === key)!,
          value,
        } satisfies RiceInspectionSubStandard)
    );
    const riceTypePercentage = Object.entries(defect).map(([key, value]) => ({
      name: key,
      value,
    }));
    console.log(composition, defect);
    console.log(standardData);
    console.log(riceTypePercentage);
    const creatingItem = {
      name: item.name,
      createDate: item.createDate,
      id: randomUUID(),
      standardID: item.standardID,
      note: item.note,
      standardName: item.standardName,
      samplingDate: item.samplingDate,
      samplingPoint: item.samplingPoint,
      imageLink: rawRiceAnalysis.imageURL,
      standardData,
      riceTypePercentage,
      price: item.price,
      type: this.baseRiceKey,
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
