import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { MilestoneWithTasksEntity } from '@/modules/milestones/types/entity';

export const getMilestone = async (
  milestoneId: string,
  config?: AxiosRequestConfig,
): Promise<MilestoneWithTasksEntity> => {
  return api.get(`/milestones/${milestoneId}`, {
    signal: config?.signal,
  });
};
