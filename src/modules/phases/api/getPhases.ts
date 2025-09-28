import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { PhaseEntity } from '@/modules/phases/types/entity';

export const getPhases = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<PhaseEntity[]> => {
  return api.get(`/phases/${projectId}`, {
    signal: config?.signal,
  });
};
