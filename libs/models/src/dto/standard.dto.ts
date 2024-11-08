import { z } from 'zod';
import { InspectionSamplingPointConditions } from '../standard';
import { RequestSchema } from './utils';

export const StandardDto = z.object({
  name: z.string(),
  id: z.string(),
  createDate: z.string().datetime(),
  standardName: z.string(),
  standardData: z.array(
    z.object({
      key: z.string(),
      minLength: z.number().nonnegative(),
      maxLength: z.number().nonnegative(),
      shape: z.array(z.string()),
      name: z.string(),
      conditionMin: z.nativeEnum(InspectionSamplingPointConditions),
      conditionMax: z.nativeEnum(InspectionSamplingPointConditions),
    })
  ),
});

export const QueryStandardRequestSchema: RequestSchema = {
  querystring: z.object({}),
  body: z.object({}),
  params: z.object({}),
};
