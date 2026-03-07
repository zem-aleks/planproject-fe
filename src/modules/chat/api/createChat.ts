import type { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api';
import type { ChatContext, ChatEntity } from '@/modules/chat/types/entity';

export const createChat = async (
  projectId: string,
  context?: ChatContext,
  config?: AxiosRequestConfig,
): Promise<ChatEntity> => {
  return api.post(`/projects/${projectId}/chats`, context ? { context } : {}, {
    signal: config?.signal,
  });
};
