import { RiceSubStandard } from './standard';

export type RiceInspectionResult = {
  type: string;
  id: string;
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
