import { useCallback, useRef, useState } from 'react';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { sendChatMessage } from '@/modules/chat/api/sendChatMessage';
import type { ChatMessage } from '@/modules/chat/types/entity';

type UseChatStreamParams = {
  projectId: string;
  chatId: string;
  onUserMessage: (message: ChatMessage) => void;
  onAssistantChunk: (content: string) => void;
  onConfirm: (proposal: { id: string; description: string }) => void;
  onAssistantDone: (messageId: string, chatName?: string) => void;
  onError: () => void;
};

export const useChatStream = ({
  projectId,
  chatId,
  onUserMessage,
  onAssistantChunk,
  onConfirm,
  onAssistantDone,
  onError,
}: UseChatStreamParams) => {
  const { session } = useAuthSession();
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!session?.access_token || isStreaming) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: text,
        proposals: [],
        createdAt: new Date().toISOString(),
      };
      onUserMessage(userMessage);

      setIsStreaming(true);
      const controller = new AbortController();
      controllerRef.current = controller;

      let settled = false;

      try {
        await sendChatMessage(
          projectId,
          chatId,
          text,
          session.access_token,
          {
            onChunk: onAssistantChunk,
            onConfirm,
            onDone: (messageId, chatName) => {
              settled = true;
              setIsStreaming(false);
              controllerRef.current = null;
              onAssistantDone(messageId, chatName);
            },
            onError: () => {
              settled = true;
              setIsStreaming(false);
              controllerRef.current = null;
              onError();
            },
          },
          controller.signal,
        );
      } catch {
        // AbortError or network error
      } finally {
        if (!settled) {
          setIsStreaming(false);
          controllerRef.current = null;
          onError();
        }
      }
    },
    [
      session?.access_token,
      isStreaming,
      projectId,
      chatId,
      onUserMessage,
      onAssistantChunk,
      onConfirm,
      onAssistantDone,
      onError,
    ],
  );

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsStreaming(false);
  }, []);

  return { sendMessage, isStreaming, abort };
};
