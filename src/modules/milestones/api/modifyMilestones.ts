import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { PhaseEntity } from '@/modules/phases/types/entity';

export const modifyMilestones = async (
  { phaseId, ...data }: { phaseId: string; message: string },
  config?: AxiosRequestConfig,
): Promise<PhaseEntity> => {
  return api.put(`/milestones/${phaseId}`, data, {
    signal: config?.signal,
  });
};
