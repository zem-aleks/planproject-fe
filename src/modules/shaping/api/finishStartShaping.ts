import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const finishStartShaping = async (
  { shapingId, clientId }: { shapingId: string; clientId: string },
  config?: AxiosRequestConfig,
): Promise<ProjectEntity> => {
  return api.patch(
    `/start/${shapingId}`,
    { clientId },
    {
      signal: config?.signal,
    },
  );
};
