import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const finishShaping = async (
  shapingId: string,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(`/shaping/${shapingId}/finish`, {
    signal: config?.signal,
  });
};
