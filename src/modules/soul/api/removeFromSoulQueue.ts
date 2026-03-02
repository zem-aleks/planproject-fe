import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import type { ProjectEntity } from '@/modules/projects/types/entity';

export const removeFromSoulQueue = async (
  projectId: string,
  body: { operationId: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.delete(`/projects/${projectId}/soul/queue`, {
    data: body,
    signal: config?.signal,
  });
};
