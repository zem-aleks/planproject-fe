import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { MilestoneEntity } from '@/modules/milestones/types/entity';

export const startMilestone = async (
  milestoneId: string,
  config?: AxiosRequestConfig,
): Promise<MilestoneEntity> => {
  return api.patch(`/milestones/${milestoneId}`, {
    signal: config?.signal,
  });
};
