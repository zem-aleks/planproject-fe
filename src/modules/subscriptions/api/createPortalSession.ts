import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';

export const createPortalSession = async (
  data: void,
  config?: AxiosRequestConfig,
): Promise<{ url: string }> => {
  return api.post(`/checkout/create-portal-session`, data, {
    signal: config?.signal,
  });
};
