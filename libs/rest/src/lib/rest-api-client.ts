import type { ZodSchema } from 'zod';
import type { NonNever } from 'ts-essentials';
import axios, { AxiosRequestConfig } from 'axios';

type Infer<T extends ZodSchema> = T extends ZodSchema<infer R> ? R : never;

type EmptySchema = ZodSchema<never>;

export type ApiSchema<
  QueryParams extends ZodSchema = ZodSchema,
  Body extends ZodSchema = ZodSchema,
  UrlParams extends ZodSchema = ZodSchema,
  ResponseSchema = Record<number, ZodSchema>
> = {
  querystring?: QueryParams;
  body?: Body;
  params?: UrlParams;
  response?: ResponseSchema;
};

declare module 'axios' {
  interface AxiosRequestConfig {
    urlParams?: Record<string, string>;
  }
}

type ParamConfig<
  QueryParams extends ZodSchema,
  Body extends ZodSchema,
  UrlParams extends ZodSchema
> = {
  params: QueryParams extends EmptySchema ? never : Infer<QueryParams>;
  data: Body extends EmptySchema ? never : Infer<Body>;
  urlParams: UrlParams extends EmptySchema ? never : Infer<UrlParams>;
};

export type ApiClientConfig<
  QueryParams extends ZodSchema = EmptySchema,
  Body extends ZodSchema = EmptySchema,
  UrlParams extends ZodSchema = EmptySchema
> = Omit<AxiosRequestConfig, 'params' | 'data' | 'urlParams'> &
  NonNever<ParamConfig<QueryParams, Body, UrlParams>>;

export class RestApiClient {
  constructor(private client = axios.create()) {
    this.client.interceptors.request.use((config) => {
      if (!config.url) {
        return config;
      }
      const currentUrl = new URL(config.url, config.baseURL);

      Object.entries(config.urlParams || {}).forEach(([k, v]) => {
        currentUrl.pathname = currentUrl.pathname.replace(
          `:${k}`,
          encodeURIComponent(v)
        );
      });

      const authPart =
        currentUrl.username && currentUrl.password
          ? `${currentUrl.username}:${currentUrl.password}`
          : '';

      return {
        ...config,
        baseURL: `${currentUrl.protocol}//${authPart}${currentUrl.host}`,
        url: currentUrl.pathname,
      };
    });
  }

  async request<
    ResDto,
    QueryParams extends ZodSchema = EmptySchema,
    Body extends ZodSchema = EmptySchema,
    UrlParams extends ZodSchema = EmptySchema
  >(
    config: ApiClientConfig<QueryParams, Body, UrlParams>,
    schema: ApiSchema<QueryParams, Body, UrlParams> = {}
  ) {
    return this.client.request<ResDto>(config);
  }
}
