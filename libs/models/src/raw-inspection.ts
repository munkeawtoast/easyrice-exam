import { z } from 'zod';

export const RiceGrainSchema = z.object({
  length: z.number(),
  weight: z.number(),
  shape: z.string(),
  type: z.string(),
});
export type RiceGrain = z.infer<typeof RiceGrainSchema>;

export const RiceRawAnalysisSchema = z.object({
  requestID: z.string(),
  imageURL: z.string().url(),
  grains: z.array(RiceGrainSchema),
});
export type RiceRawAnalysis = z.infer<typeof RiceRawAnalysisSchema>;
