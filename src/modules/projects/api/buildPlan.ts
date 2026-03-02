import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const buildPlan = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(
    `/projects/${projectId}/build-plan`,
    {},
    {
      signal: config?.signal,
    },
  );
};
