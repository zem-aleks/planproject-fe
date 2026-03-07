import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import type {
  ProjectEntity,
  SoulOperationInput,
} from '@/modules/projects/types/entity';

export const addToSoulQueue = async (
  projectId: string,
  body: SoulOperationInput,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(`/projects/${projectId}/soul/queue`, body, {
    signal: config?.signal,
  });
};
