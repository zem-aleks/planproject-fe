import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { PhaseEntity } from '@/modules/phases/types/entity';

export const createMilestones = async (
  phaseId: string,
  config?: AxiosRequestConfig,
): Promise<PhaseEntity> => {
  return api.post(
    `/milestones/${phaseId}`,
    {},
    {
      signal: config?.signal,
    },
  );
};
