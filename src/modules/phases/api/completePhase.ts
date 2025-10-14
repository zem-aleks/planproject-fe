import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { PhaseEntity } from '@/modules/phases/types/entity';

export const completePhase = async (
  phaseId: string,
  config?: AxiosRequestConfig,
): Promise<PhaseEntity> => {
  return api.patch(
    `/phases/${phaseId}/complete`,
    {},
    {
      signal: config?.signal,
    },
  );
};
