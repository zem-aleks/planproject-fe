import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { AuditoryEntity } from '@/modules/auditory/types/entity';

export const createAuditoryInfo = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<AuditoryEntity> => {
  return api.patch(`/auditory/${projectId}`, {
    signal: config?.signal,
  });
};
