export type RiceGrain = {
  length: number;
  weight: number;
  shape: string;
  type: string;
};

export type RiceAnalysis = {
  requestID: string;
  imageURL: string;
  grains: RiceGrain[];
};
