import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const removeOpenQuestion = async (
  projectId: string,
  body: { topic: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.delete(`/projects/${projectId}/soul/open-questions`, {
    data: body,
    signal: config?.signal,
  });
};
