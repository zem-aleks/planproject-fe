import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const generateProjectLogo = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.patch(
    `/start/${projectId}/logo`,
    {},
    {
      signal: config?.signal,
    },
  );
};
