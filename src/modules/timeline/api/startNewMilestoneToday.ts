import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';

export const startNewMilestoneToday = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<MilestoneDetailsEntity | null> => {
  return api.post(`/timeline/${projectId}/extend-today`, {
    signal: config?.signal,
  });
};
