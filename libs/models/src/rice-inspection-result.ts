import { Prettify } from 'ts-essentials';
import { RiceSubStandard } from './standard';

export type RiceInspectionSubStandard = Prettify<
  RiceSubStandard & {
    value: number;
  }
>;

export type RiceInspectionResult = {
  type: string;
  id: string;
  name: string;
  createDate?: string;
  standardID: string;
  note?: string;
  standardName: string;
  samplingDate: string;
  samplingPoint: string[];
  price?: number;
  imageLink: string;
  standardData: RiceInspectionSubStandard[];
  riceTypePercentage: {
    name: string;
    value: number;
  }[];
};
