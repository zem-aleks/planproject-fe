import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { TimelinePointEntity } from '@/modules/timeline/types/entity';

export const startNewMilestoneToday = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<TimelinePointEntity | null> => {
  return api.post(`/timeline/${projectId}/extend-today`, {
    signal: config?.signal,
  });
};
