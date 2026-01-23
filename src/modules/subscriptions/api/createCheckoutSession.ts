import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import {
  SubscriptionPeriod,
  SubscriptionType,
} from '@/modules/users/types/user';

export const createCheckoutSession = async (
  data: { type: SubscriptionType; period: SubscriptionPeriod },
  config?: AxiosRequestConfig,
): Promise<{ url: string }> => {
  return api.post(`/checkout/create-session`, data, {
    signal: config?.signal,
  });
};
