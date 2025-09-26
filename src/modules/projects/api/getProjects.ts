import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const getProjects = async (
  _: void,
  config?: AxiosRequestConfig,
): Promise<ProjectEntity[]> => {
  return api.get(`/projects`, {
    signal: config?.signal,
  });
};
