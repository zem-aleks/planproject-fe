import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { TaskEntity } from '@/modules/tasks/types/entity';

export const createTasks = async (
  milestoneId: string,
  config?: AxiosRequestConfig,
): Promise<TaskEntity[]> => {
  return api.post(
    `/tasks/${milestoneId}`,
    {},
    {
      signal: config?.signal,
    },
  );
};
