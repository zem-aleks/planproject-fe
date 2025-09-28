import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ShapingEntity } from '@/modules/shaping/types/entity';

export const getShaping = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ShapingEntity> => {
  return api.get(`/shaping/project/${projectId}`, {
    signal: config?.signal,
  });
};
