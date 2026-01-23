import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';

export const createCheckoutSession = async (
  data: { priceId: string },
  config?: AxiosRequestConfig,
): Promise<{ url: string }> => {
  return api.post(`/checkout/create-session`, data, {
    signal: config?.signal,
  });
};
