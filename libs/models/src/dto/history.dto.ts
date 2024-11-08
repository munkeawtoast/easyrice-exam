import { z } from 'zod';

export const HistoryDto = z.object({
  name: z.string().optional(),
  createDate: z.string().datetime().optional(),
  inspectionID: z.string().optional(),
  standardID: z.string().optional(),
  note: z.string().optional(),
  standardName: z.string().optional(),
  samplingDate: z.string().datetime().optional(),
  samplingPoint: z.array(z.string()).optional(),
  price: z.number().optional(),
});

const HistoryListResponseDtoSchema = z.object({
  data: z.array(HistoryDto),
});

export type HistoryListResponseDto = z.infer<
  typeof HistoryListResponseDtoSchema
>;
