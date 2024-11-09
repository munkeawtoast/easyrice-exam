import { RiceSubStandard } from './standard';

export type RiceInspectionSubStandard = RiceSubStandard & {
  value: number;
};

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
};
