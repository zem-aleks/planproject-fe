import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const unlockProject = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.patch(
    `/projects/${projectId}/unlock`,
    {},
    {
      signal: config?.signal,
    },
  );
};
