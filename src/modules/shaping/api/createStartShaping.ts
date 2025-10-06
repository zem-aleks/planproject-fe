import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ShapingEntity } from '@/modules/shaping/types/entity';

export const createStartShaping = async (
  data: { message: string; clientId: string },
  config?: AxiosRequestConfig,
): Promise<ShapingEntity> => {
  return api.post(`/start`, data, {
    signal: config?.signal,
  });
};
