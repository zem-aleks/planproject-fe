import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import type { ChatEntity } from '@/modules/chat/types/entity';

export const getChat = async (
  { projectId, chatId }: { projectId: string; chatId: string },
  config?: AxiosRequestConfig,
): Promise<ChatEntity> => {
  return api.get(`/projects/${projectId}/chats/${chatId}`, {
    signal: config?.signal,
  });
};
