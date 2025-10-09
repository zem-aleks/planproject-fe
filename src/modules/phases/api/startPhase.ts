import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { PhaseEntity } from '@/modules/phases/types/entity';

export const startPhase = async (
  phaseId: string,
  config?: AxiosRequestConfig,
): Promise<PhaseEntity> => {
  return api.patch(
    `/phases/${phaseId}`,
    {},
    {
      signal: config?.signal,
    },
  );
};
