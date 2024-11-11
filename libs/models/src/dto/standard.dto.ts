import { z } from 'zod';
import { InspectionSamplingPointConditions } from '../standard';
import { ApiSchema } from '@libs/rest';

export const SubStandardSchemaDto = z.object({
  key: z.string(),
  minLength: z.number().nonnegative(),
  maxLength: z.number().nonnegative(),
  shape: z.array(z.string()),
  name: z.string(),
  conditionMin: z.nativeEnum(InspectionSamplingPointConditions),
  conditionMax: z.nativeEnum(InspectionSamplingPointConditions),
});

export const StandardSchemaDto = z.object({
  id: z.string(),
  createDate: z.string().datetime().optional(),
  standardName: z.string(),
  standardData: z.array(SubStandardSchemaDto),
});

export type StandardDto = z.infer<typeof StandardSchemaDto>;

export const ListStandardResponseSchema = z.array(StandardSchemaDto);

export const ListStandardApiSchema = {
  response: {
    200: ListStandardResponseSchema,
  },
} satisfies ApiSchema;
