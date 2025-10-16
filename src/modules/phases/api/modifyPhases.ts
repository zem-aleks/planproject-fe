import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { PhaseEntity } from '@/modules/phases/types/entity';

export const modifyPhases = async (
  { projectId, ...data }: { projectId: string; message: string },
  config?: AxiosRequestConfig,
): Promise<PhaseEntity[]> => {
  return api.put(`/phases/${projectId}`, data, {
    signal: config?.signal,
  });
};
