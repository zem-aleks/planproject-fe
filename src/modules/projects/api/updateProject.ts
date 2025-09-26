import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import {
  ProjectCreateData,
  ProjectEntity,
} from '@/modules/projects/types/entity';

export const updateProject = async (
  { id, ...data }: ProjectCreateData & { id: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.patch(`/projects/${id}`, data, {
    signal: config?.signal,
  });
};
