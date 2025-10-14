import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { TaskEntity } from '@/modules/tasks/types/entity';

export const completeTask = async (
  { taskId, ...data }: { taskId: string; message: string },
  config?: AxiosRequestConfig,
): Promise<TaskEntity> => {
  return api.patch(`/tasks/complete/${taskId}`, data, {
    signal: config?.signal,
  });
};
