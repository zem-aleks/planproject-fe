import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import type { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';

export const getTodayTimeline = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<MilestoneDetailsEntity[]> => {
  return api.get(`/timeline/${projectId}/today`, {
    signal: config?.signal,
  });
};
