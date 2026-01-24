import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { SubscriptionEntity } from '@/modules/subscriptions/types/entity';

export const getSubscription = async (
  _: void,
  config?: AxiosRequestConfig,
): Promise<SubscriptionEntity> => {
  return api.get(`/subscription`, {
    signal: config?.signal,
  });
};
