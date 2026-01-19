import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';

export const getFocusComment = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<string> => {
  return api.get(`/timeline/${projectId}/comment`, {
    signal: config?.signal,
  });
};
