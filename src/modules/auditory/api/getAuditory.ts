import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { AuditoryEntity } from '@/modules/auditory/types/entity';

export const getAuditory = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<AuditoryEntity> => {
  return api.get(`/auditory/${projectId}`, {
    signal: config?.signal,
  });
};
