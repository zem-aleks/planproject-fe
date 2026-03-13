import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import type { ProjectEntity } from '@/modules/projects/types/entity';

export const regenerateProjectLogo = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.patch(
    `/projects/${projectId}/logo`,
    {},
    {
      signal: config?.signal,
    },
  );
};
