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
  name: z.string(),
  id: z.string(),
  createDate: z.string().datetime(),
  standardName: z.string(),
  standardData: z.array(SubStandardSchemaDto),
});

export const ListStandardApiSchema = {
  response: {
    200: z.array(StandardSchemaDto),
  },
} satisfies ApiSchema;
