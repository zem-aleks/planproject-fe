import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';
import { ShapingEntity } from '@/modules/shaping/types/entity';

export const addStartShapingUserMessage = async (
  {
    shapingId,
    ...data
  }: { shapingId: string; clientId: string; message: string },
  config?: AxiosRequestConfig,
): Promise<ShapingEntity> => {
  return api.post(`/start/${shapingId}`, data, {
    signal: config?.signal,
  });
};
