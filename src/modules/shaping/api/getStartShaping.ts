import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ShapingEntity } from '@/modules/shaping/types/entity';

export const getStartShaping = async (
  clientId: string,
  config?: AxiosRequestConfig,
): Promise<ShapingEntity | null> => {
  return api.get(`/start/${clientId}`, {
    signal: config?.signal,
  });
};
