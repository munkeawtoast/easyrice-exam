export enum InspectionSamplingPoints {
  frontend = 'frontend',
  backend = 'backend',
  other = 'other',
}

export enum InspectionSamplingPointConditions {
  GE = 'GE',
  LE = 'LE',
  GT = 'GT',
  LT = 'LT',
  EQ = 'EQ',
  NE = 'NE',
}

export type RiceSubStandard = {
  key: string;
  minLength: number;
  maxLength: number;
  shape: string[];
  name: string;
  conditionMin: InspectionSamplingPointConditions;
  conditionMax: InspectionSamplingPointConditions;
};
export type RiceStandard = {
  type: string;
  id: string;
  name: string;
  createDate: string;
  standardData: RiceSubStandard[];
};
