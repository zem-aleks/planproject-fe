import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const connectProject = async (
  { projectId, ...data }: { projectId: string; clientId: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.put(`/shaping/${projectId}/connect`, data, {
    signal: config?.signal,
  });
};
