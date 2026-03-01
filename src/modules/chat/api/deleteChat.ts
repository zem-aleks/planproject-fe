import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';

export const deleteChat = async (
  { projectId, chatId }: { projectId: string; chatId: string },
  config?: AxiosRequestConfig,
): Promise<void> => {
  return api.delete(`/projects/${projectId}/chats/${chatId}`, {
    signal: config?.signal,
  });
};
