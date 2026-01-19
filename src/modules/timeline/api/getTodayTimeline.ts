import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';

export const getTodayTimeline = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<MilestoneDetailsEntity | null> => {
  return api.get(`/timeline/${projectId}/today`, {
    signal: config?.signal,
  });
};
