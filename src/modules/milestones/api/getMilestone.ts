import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';

export const getMilestone = async (
  milestoneId: string,
  config?: AxiosRequestConfig,
): Promise<MilestoneDetailsEntity> => {
  return api.get(`/milestones/${milestoneId}`, {
    signal: config?.signal,
  });
};
