import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ShapingEntity } from '@/modules/shaping/types/entity';

export const finishShaping = async (
  shapingId: string,
  config?: AxiosRequestConfig,
): Promise<ShapingEntity> => {
  return api.post(`/shaping/${shapingId}/finish`, {
    signal: config?.signal,
  });
};
