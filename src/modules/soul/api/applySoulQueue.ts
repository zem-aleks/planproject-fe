import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import type { ProjectEntity } from '@/modules/projects/types/entity';

export const applySoulQueue = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(`/projects/${projectId}/soul/queue/apply`, undefined, {
    signal: config?.signal,
  });
};
