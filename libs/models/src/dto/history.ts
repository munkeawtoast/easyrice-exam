import { z } from 'zod';
import { SubStandardSchemaDto } from './standard';
import { ApiSchema } from '@libs/rest';
import { RiceRawAnalysisSchema } from '../raw-inspection';

export const HistorySubStandardSchemaDto = SubStandardSchemaDto.merge(
  z.object({
    value: z.number(),
  })
);
export type HistorySubStandardData = z.infer<
  typeof HistorySubStandardSchemaDto
>;

export const HistoryDtoSchema = z.object({
  name: z.string(),
  createDate: z.string().datetime().optional(),
  inspectionID: z.string(),
  standardID: z.string(),
  note: z.string().optional(),
  standardName: z.string(),
  samplingDate: z.string().datetime().optional(),
  samplingPoint: z.array(z.string()),
  price: z.number().optional(),
});

export type HistoryDto = z.infer<typeof HistoryDtoSchema>;

export const FullHistoryDtoSchema = HistoryDtoSchema.merge(
  z.object({
    imageLink: z.string().url(),
    standardData: z.array(HistorySubStandardSchemaDto),
    riceTypePercentage: z
      .object({
        name: z.string(),
        value: z.number(),
      })
      .array(),
  })
);

export const CreateHistoryRequestBodySchema = FullHistoryDtoSchema.omit({
  inspectionID: true,
  imageLink: true,
  standardData: true,
  riceTypePercentage: true,
}).merge(
  z.object({
    samplingPoint: z.array(z.string()),
    standardData: z.array(SubStandardSchemaDto),
    rawData: RiceRawAnalysisSchema.optional(),
  })
);
export type CreateHistoryRequestBody = z.infer<
  typeof CreateHistoryRequestBodySchema
>;

export const PutHistoryRequestBodySchema = HistoryDtoSchema.pick({
  note: true,
  price: true,
  samplingPoint: true,
  samplingDate: true,
});
export type PutHistoryRequestBody = z.infer<typeof PutHistoryRequestBodySchema>;

export const PutHistoryParamsSchema = z.object({
  inspectionID: z.string(),
});
export type PutHistoryParams = z.infer<typeof PutHistoryParamsSchema>;

export type FullHistoryDto = z.infer<typeof FullHistoryDtoSchema>;

export const GetHistoryResponseSchema = FullHistoryDtoSchema;
export type GetHistoryResponseDto = z.infer<typeof GetHistoryResponseSchema>;

export const GetHistoryApiSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    200: GetHistoryResponseSchema,
    404: z.string(),
  },
} satisfies ApiSchema;
export type GetHistoryApi = typeof GetHistoryApiSchema;

export const ListHistoryResponseSchema = z.object({
  data: z.array(HistoryDtoSchema),
});

export type ListHistoryResopnseDto = z.infer<typeof ListHistoryResponseSchema>;

export const ListHistoryApiSchema = {
  querystring: z.object({
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
    inspectionID: z.string().optional(),
  }),
  response: {
    200: ListHistoryResponseSchema,
    500: z.string(),
  },
} satisfies ApiSchema;

export type HistoryListResponseDto = z.infer<typeof ListHistoryResponseSchema>;

export const PutHistoryApiSchema = {
  body: PutHistoryRequestBodySchema,
  params: PutHistoryParamsSchema,
  response: {
    201: FullHistoryDtoSchema,
  },
} satisfies ApiSchema;

export const CreateHistoryApiSchema = {
  body: CreateHistoryRequestBodySchema,
  response: {
    201: FullHistoryDtoSchema,
  },
} satisfies ApiSchema;

export const DeleteHistoryApiSchema = {
  body: z.object({
    inspectionID: z.array(z.string()),
  }),
  response: {
    200: z.string(),
  },
} satisfies ApiSchema;
