import { RestApiClient } from '@libs/rest';
import axiosClient from './client';
import {
  ListStandardApiSchema,
  ListStandardResponseDto,
} from '@libs/dto/standard';

const apiClient = new RestApiClient(axiosClient);
const StandardApi = {
  listStandard: async () => {
    const response = await apiClient.request(
      {
        url: '/standard',
        method: 'GET',
      },
      ListStandardApiSchema
    );
    return response.data as ListStandardResponseDto;
  },
};

export default StandardApi;
