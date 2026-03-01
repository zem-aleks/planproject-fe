import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const removeAssumption = async (
  projectId: string,
  body: { assumption: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.delete(`/projects/${projectId}/soul/assumptions`, {
    data: body,
    signal: config?.signal,
  });
};
