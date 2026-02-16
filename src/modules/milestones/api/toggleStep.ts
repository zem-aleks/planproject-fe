import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { MilestoneEntity } from '@/modules/milestones/types/entity';

export const toggleStep = async (
  { milestoneId, stepId, ...data }: { milestoneId: string; stepId: string },
  config?: AxiosRequestConfig,
): Promise<MilestoneEntity> => {
  return api.patch(`/milestones/${milestoneId}/steps/${stepId}/toggle`, data, {
    signal: config?.signal,
  });
};
