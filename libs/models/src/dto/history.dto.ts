import { z } from 'zod';
import { StandardDto } from './standard.dto';
import { ApiSchema } from '@libs/rest';

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
  imageLink: z.string().optional(),
  standardData: z.array(StandardDto),
});

export const HistoryResponseSchema = HistoryDto;

export const HistoryApiSchema: ApiSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    200: HistoryResponseSchema,
  },
};

export const HistoryListResponseDtoSchema = z.object({
  data: z.array(HistoryDto),
});

export type HistoryListResponseDto = z.infer<
  typeof HistoryListResponseDtoSchema
>;
