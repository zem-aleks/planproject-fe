import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import type { ChatPreviewEntity } from '@/modules/chat/types/entity';

export const getChats = async (
  projectId: string,
  config?: AxiosRequestConfig,
): Promise<ChatPreviewEntity[]> => {
  return api.get(`/projects/${projectId}/chats`, {
    signal: config?.signal,
  });
};
