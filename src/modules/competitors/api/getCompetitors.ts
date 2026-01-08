import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import { CompetitorEntity } from '@/modules/competitors/types/entity';

export const getCompetitors = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<CompetitorEntity[]> => {
  return api.get(`/competitors/${projectId}`, {
    signal: config?.signal,
  });
};
