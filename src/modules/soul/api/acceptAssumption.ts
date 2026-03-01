import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const acceptAssumption = async (
  projectId: string,
  body: { assumption: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(`/projects/${projectId}/soul/assumptions/accept`, body, {
    signal: config?.signal,
  });
};
