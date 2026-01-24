import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';

export const getProjects = async (
  _: void,
  config?: AxiosRequestConfig,
): Promise<ProjectPreviewEntity[]> => {
  return api.get(`/projects`, {
    signal: config?.signal,
  });
};
