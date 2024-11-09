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
  })
);

export type FullHistoryDto = z.infer<typeof FullHistoryDtoSchema>;

export const GetHistoryResponseSchema = FullHistoryDtoSchema;

export const GetHistoryApiSchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    200: GetHistoryResponseSchema,
  },
} satisfies ApiSchema;

export const ListHistoryResponseSchema = z.object({
  data: z.array(HistoryDtoSchema),
});

export const ListHistoryApiSchema = {
  querystring: z.object({
    fromDate: z.string().datetime(),
    toDate: z.string().datetime(),
    inspectionID: z.string(),
  }),
  response: {
    200: ListHistoryResponseSchema,
  },
} satisfies ApiSchema;

export type HistoryListResponseDto = z.infer<typeof ListHistoryResponseSchema>;

export const CreateHistoryApiSchema = {
  body: FullHistoryDtoSchema,
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
};
