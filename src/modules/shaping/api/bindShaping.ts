import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const bindShaping = async (
  { shapingId, ...data }: { shapingId: string; clientId: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(`/shaping/bind/${shapingId}`, data, {
    signal: config?.signal,
  });
};
