import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { PhaseEntity } from '@/modules/phases/types/entity';

export const getPhase = async (
  phaseId: string,
  config?: AxiosRequestConfig,
): Promise<PhaseEntity> => {
  return api.get(`/phases/view/${phaseId}`, {
    signal: config?.signal,
  });
};
