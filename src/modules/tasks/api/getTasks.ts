import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { TaskEntity } from '@/modules/tasks/types/entity';

export const getTasks = async (
  milestoneId: string,
  config?: AxiosRequestConfig,
): Promise<TaskEntity[]> => {
  return api.get(`/tasks/${milestoneId}`, {
    signal: config?.signal,
  });
};
