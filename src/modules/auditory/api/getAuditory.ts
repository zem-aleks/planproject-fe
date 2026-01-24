import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { AuditoryData } from '@/modules/auditory/types/entity';

export const getAuditory = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<AuditoryData | null> => {
  return api.get(`/auditory/${projectId}`, {
    signal: config?.signal,
  });
};
