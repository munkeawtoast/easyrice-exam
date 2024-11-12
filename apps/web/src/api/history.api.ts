import { RestApiClient } from '@libs/rest';
import axiosClient from './client';
import {
  FullHistoryDto,
  GetHistoryApiSchema,
  GetHistoryResponseDto,
  ListHistoryApiSchema,
  ListHistoryResopnseDto,
  DeleteHistoryApiSchema,
  PutHistoryApiSchema,
  CreateHistoryRequestBody,
  PutHistoryRequestBody,
  PutHistoryParams,
  CreateHistoryApiSchema,
} from '@libs/dto/history';

const apiClient = new RestApiClient(axiosClient);
const HistoryApi = {
  getHistory: async (userId: string) => {
    const response = await apiClient.request(
      {
        urlParams: { id: userId },
        method: 'GET',
        url: '/history/:id',
      },
      GetHistoryApiSchema
    );
    return response.data as GetHistoryResponseDto;
  },
  listHistory: async (
    fromDate?: string,
    toDate?: string,
    inspectionID?: string
  ) => {
    const response = await apiClient.request(
      {
        url: '/history',
        method: 'GET',
        params: { fromDate, toDate, inspectionID },
      },
      ListHistoryApiSchema
    );
    return response.data as ListHistoryResopnseDto;
  },
  createHistory: async (data: CreateHistoryRequestBody) => {
    const response = await apiClient.request(
      {
        url: '/history',
        method: 'POST',
        data,
      },
      CreateHistoryApiSchema
    );
    return response.data as FullHistoryDto;
  },
  updateHistory: async ({
    inspectionID,
    ...data
  }: PutHistoryRequestBody & PutHistoryParams) => {
    const response = await apiClient.request(
      {
        url: '/history/:inspectionID',
        method: 'PUT',
        urlParams: { inspectionID },
        data,
      },
      PutHistoryApiSchema
    );
    return response.data as FullHistoryDto;
  },
  deleteHistory: async (inspectionID: string[]) => {
    const response = await apiClient.request(
      {
        url: '/history',
        method: 'DELETE',
        data: { inspectionID },
      },
      DeleteHistoryApiSchema
    );
    return response.data as string;
  },
};

export default HistoryApi;
