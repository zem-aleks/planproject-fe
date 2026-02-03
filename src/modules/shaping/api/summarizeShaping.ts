import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ShapingEntity } from '@/modules/shaping/types/entity';

export const summarizeShaping = async (
  { shapingId, clientId }: { shapingId: string; clientId: string },
  config?: AxiosRequestConfig,
): Promise<ShapingEntity> => {
  return api.post(
    `/start/${shapingId}/summary`,
    { clientId },
    {
      signal: config?.signal,
    },
  );
};
