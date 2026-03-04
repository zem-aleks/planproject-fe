import { useCallback, useRef, useState } from 'react';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import {
  type ProposalProgressStage,
  sendChatMessage,
} from '@/modules/chat/api/sendChatMessage';
import type { ChatMessage, UnlockedSection } from '@/modules/chat/types/entity';

type UseChatStreamParams = {
  projectId: string;
  chatId: string;
  onUserMessage: (message: ChatMessage) => void;
  onAssistantChunk: (content: string) => void;
  onConfirm: (proposal: { id: string; description: string }) => void;
  onSectionUnlocked?: (section: UnlockedSection) => void;
  onAssistantDone: (messageId: string, chatName?: string) => void;
  onError: () => void;
};

export const useChatStream = ({
  projectId,
  chatId,
  onUserMessage,
  onAssistantChunk,
  onConfirm,
  onSectionUnlocked,
  onAssistantDone,
  onError,
}: UseChatStreamParams) => {
  const { session } = useAuthSession();
  const [isStreaming, setIsStreaming] = useState(false);
  const [toolCallName, setToolCallName] = useState<string | null>(null);
  const [proposalStage, setProposalStage] =
    useState<ProposalProgressStage | null>(null);
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
            onChunk: (content) => {
              setToolCallName(null);
              setProposalStage(null);
              onAssistantChunk(content);
            },
            onToolCall: (name) => {
              setToolCallName(name);
              setProposalStage(null);
            },
            onSectionUnlocked: (section) => {
              onSectionUnlocked?.(section);
            },
            onProposalProgress: (stage) => {
              setProposalStage(stage);
            },
            onConfirm: (proposal) => {
              setToolCallName(null);
              setProposalStage(null);
              onConfirm(proposal);
            },
            onDone: (messageId, chatName) => {
              settled = true;
              setIsStreaming(false);
              setToolCallName(null);
              setProposalStage(null);
              controllerRef.current = null;
              onAssistantDone(messageId, chatName);
            },
            onError: () => {
              settled = true;
              setIsStreaming(false);
              setToolCallName(null);
              setProposalStage(null);
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
          setToolCallName(null);
          setProposalStage(null);
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
      onSectionUnlocked,
      onAssistantDone,
      onError,
    ],
  );

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsStreaming(false);
    setToolCallName(null);
    setProposalStage(null);
  }, []);

  return { sendMessage, isStreaming, toolCallName, proposalStage, abort };
};
