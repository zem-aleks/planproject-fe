import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import {
  ProjectCreateData,
  ProjectEntity,
} from '@/modules/projects/types/entity.ts';

export const createProject = async (
  data: ProjectCreateData,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(`/projects`, data, {
    signal: config?.signal,
  });
};
