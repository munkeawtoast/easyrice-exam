export enum InspectionSamplingPoints {
  frontend = 'frontend',
  backend = 'backend',
  other = 'other',
}

export enum InspectionSamplingPointConditions {
  GE = 'GE', // Greater than or equal
  LE = 'LE', // Less than or equal
  GT = 'GT', // Greater than
  LT = 'LT', // Less than
  EQ = 'EQ', // Equal
  NE = 'NE', // Not equal
}

export type RiceSubStandard = {
  key?: string;
  minLength?: number;
  maxLength?: number;
  shape: string[];
  name?: string;
  conditionMin?: InspectionSamplingPointConditions;
  conditionMax?: InspectionSamplingPointConditions;
  value?: number;
};
export type RiceStandard = {
  name?: string;
  createDate: string;
  inspectionID: string;
  standardID?: string;
  note?: string;
  standardName?: string;
  samplingDate?: string;
  samplingPoint?: string[];
  price?: number;
  imageLink?: string;
  standardData: RiceSubStandard[];
};
