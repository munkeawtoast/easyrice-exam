import { z } from 'zod';
import { SubStandardSchemaDto } from './standard.dto';
import { ApiSchema } from '@libs/rest';

export const HistorySubStandardSchemaDto = SubStandardSchemaDto.merge(
  z.object({
    value: z.number(),
  })
);

export const HistoryDtoSchema = z.object({
  name: z.string().optional(),
  createDate: z.string().optional(),
  inspectionID: z.string(),
  standardID: z.string(),
  note: z.string().optional(),
  standardName: z.string(),
  samplingDate: z.string().datetime(),
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
});
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
