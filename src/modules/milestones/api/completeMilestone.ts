import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { MilestoneEntity } from '@/modules/milestones/types/entity';

export const completeMilestone = async (
  { milestoneId, ...data }: { milestoneId: string; message: string },
  config?: AxiosRequestConfig,
): Promise<MilestoneEntity> => {
  return api.patch(`/milestones/complete/${milestoneId}`, data, {
    signal: config?.signal,
  });
};
