import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import type { ProjectEntity } from '@/modules/projects/types/entity';

export const cancelSoulQueue = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(`/projects/${projectId}/soul/queue/cancel`, undefined, {
    signal: config?.signal,
  });
};
