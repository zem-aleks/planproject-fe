import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { MilestoneEntity } from '@/modules/milestones/types/entity';

export const getMilestones = async (
  phaseId: string,
  config?: AxiosRequestConfig,
): Promise<MilestoneEntity[]> => {
  return api.get(`/milestones/phase/${phaseId}`, {
    signal: config?.signal,
  });
};
