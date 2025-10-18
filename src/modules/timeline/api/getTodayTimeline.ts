import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { TimelinePointEntity } from '@/modules/timeline/types/entity';

export const getTodayTimeline = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<TimelinePointEntity | null> => {
  return api.get(`/timeline/${projectId}/today`, {
    signal: config?.signal,
  });
};
