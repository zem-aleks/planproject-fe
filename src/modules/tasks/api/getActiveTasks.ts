import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { TaskEntity } from '@/modules/tasks/types/entity';

export const getActiveTasks = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<TaskEntity[]> => {
  return api.get(`/tasks/active/${projectId}`, {
    signal: config?.signal,
  });
};
