import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ShapingEntity } from '@/modules/shaping/types/entity';

export const createShaping = async (
  data: { message: string; clientId: string },
  config?: AxiosRequestConfig,
): Promise<ShapingEntity> => {
  return api.post(`/shaping`, data, {
    signal: config?.signal,
  });
};
