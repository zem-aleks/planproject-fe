import { useCallback, useEffect, useRef, useState } from 'react';

import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { getChat } from '@/modules/chat/api/getChat';
import { ChatInput } from '@/modules/chat/components/ChatInput';
import { ChatMessageBubble } from '@/modules/chat/components/ChatMessageBubble';
import { useChatStream } from '@/modules/chat/helpers/useChatStream';
import type { ChatMessage, ChatProposal } from '@/modules/chat/types/entity';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useReloadableData } from '@/utils/useReloadableData';

export const ChatConversation = ({
  projectId,
  chatId,
  onChatNameChange,
}: {
  projectId: string;
  chatId: string;
  onChatNameChange?: (name: string) => void;
}) => {
  const { state } = useReloadableData(getChat, { projectId, chatId });
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingProposals, setStreamingProposals] = useState<ChatProposal[]>(
    [],
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset local state when chat loads
  useEffect(() => {
    if (state.type === 'loaded') {
      setLocalMessages(state.data.messages);
      setStreamingContent('');
      setStreamingProposals([]);
    }
  }, [state.type === 'loaded' && state.data.id]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }, []);

  const handleProposalStatusChange = useCallback(
    (proposalId: string, status: 'approved' | 'rejected') => {
      setLocalMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          proposals: msg.proposals.map((p) =>
            p.id === proposalId ? { ...p, status } : p,
          ),
        })),
      );
    },
    [],
  );

  const { sendMessage, isStreaming, abort } = useChatStream({
    projectId,
    chatId,
    onUserMessage: (msg) => {
      setLocalMessages((prev) => [...prev, msg]);
      setStreamingContent('');
      setStreamingProposals([]);
      scrollToBottom();
    },
    onAssistantChunk: (content) => {
      setStreamingContent((prev) => prev + content);
      scrollToBottom();
    },
    onConfirm: (proposal) => {
      setStreamingProposals((prev) => [
        ...prev,
        { ...proposal, status: 'pending' },
      ]);
      scrollToBottom();
    },
    onAssistantDone: (messageId, chatName) => {
      setStreamingContent((prev) => {
        setStreamingProposals((currentProposals) => {
          const finalMessage: ChatMessage = {
            id: messageId,
            role: 'assistant',
            content: prev,
            proposals: currentProposals,
            createdAt: new Date().toISOString(),
          };
          setLocalMessages((msgs) => [...msgs, finalMessage]);
          return [];
        });
        return '';
      });
      if (chatName) {
        onChatNameChange?.(chatName);
      }
      scrollToBottom();
    },
    onError: () => {
      toast.error('Failed to get response');
      setStreamingContent((prev) => {
        if (prev) {
          const partial: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: prev,
            proposals: [],
            createdAt: new Date().toISOString(),
          };
          setLocalMessages((msgs) => [...msgs, partial]);
        }
        return '';
      });
      setStreamingProposals([]);
    },
  });

  switch (state.type) {
    case 'loading':
    case 'reloading':
      return (
        <div className="flex flex-1 items-center justify-center">
          <Spinner />
        </div>
      );

    case 'error':
      return (
        <div className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
          Failed to load chat
        </div>
      );

    case 'loaded':
      return (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
          >
            {localMessages.length === 0 && !isStreaming && (
              <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2">
                <MessageCircle className="size-8 opacity-50" />
                <p className="text-sm">
                  Send a message to start the conversation
                </p>
              </div>
            )}
            {localMessages.map((msg) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                proposals={msg.proposals}
                projectId={projectId}
                chatId={chatId}
                onProposalStatusChange={handleProposalStatusChange}
              />
            ))}
            {isStreaming && streamingContent && (
              <ChatMessageBubble
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingContent,
                  proposals: [],
                  createdAt: new Date().toISOString(),
                }}
                isStreaming
                proposals={streamingProposals}
                projectId={projectId}
                chatId={chatId}
                onProposalStatusChange={handleProposalStatusChange}
              />
            )}
          </div>

          <ChatInput
            onSend={sendMessage}
            isStreaming={isStreaming}
            onStop={abort}
          />
        </div>
      );

    default:
      return notReachable(state);
  }
};
