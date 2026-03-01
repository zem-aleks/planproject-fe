import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const answerOpenQuestion = async (
  projectId: string,
  body: { topic: string; chosenOption: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.post(`/projects/${projectId}/soul/open-questions/answer`, body, {
    signal: config?.signal,
  });
};
