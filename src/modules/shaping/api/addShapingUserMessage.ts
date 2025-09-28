import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ShapingEntity } from '@/modules/shaping/types/entity';

export const addShapingUserMessage = async (
  { shapingId, message }: { shapingId: string; message: string },
  config?: AxiosRequestConfig,
): Promise<ShapingEntity> => {
  return api.post(
    `/shaping/${shapingId}`,
    { message },
    {
      signal: config?.signal,
    },
  );
};
