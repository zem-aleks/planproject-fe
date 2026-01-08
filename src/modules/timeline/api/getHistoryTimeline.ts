import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { TimelinePointEntity } from '@/modules/timeline/types/entity';

export const getHistoryTimeline = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<TimelinePointEntity[]> => {
  return api.get(`/timeline/${projectId}/history`, {
    signal: config?.signal,
  });
};
