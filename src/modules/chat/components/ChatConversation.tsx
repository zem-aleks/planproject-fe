import { useCallback, useEffect, useRef, useState } from 'react';

import { Bot, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useReloadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getChat } from '@/modules/chat/api/getChat';
import { ChatInput } from '@/modules/chat/components/ChatInput';
import { ChatMessageBubble } from '@/modules/chat/components/ChatMessageBubble';
import { useChatStream } from '@/modules/chat/helpers/useChatStream';
import type {
  ChatContext,
  ChatEntity,
  ChatMessage,
  ChatProposal,
} from '@/modules/chat/types/entity';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { Badge } from '@/ui/badge';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';

export type ProposalRevert = {
  messageId: string;
  proposalId: string;
};

export const ChatConversation = ({
  projectId,
  chatId,
  onChatNameChange,
  onProjectUpdated,
  proposalToRevert,
}: {
  projectId: string;
  chatId: string;
  onChatNameChange?: (name: string) => void;
  onProjectUpdated?: (project: ProjectEntity) => void;
  proposalToRevert?: ProposalRevert | null;
}) => {
  const { state } = useReloadableQuery<ChatEntity>({
    queryKey: queryKeys.chats.detail(chatId),
    queryFn: ({ signal }) => getChat({ projectId, chatId }, { signal }),
  });
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

  // Optimistically revert a proposal back to pending
  useEffect(() => {
    if (!proposalToRevert) return;
    setLocalMessages((prev) =>
      prev.map((msg) =>
        msg.id === proposalToRevert.messageId
          ? {
              ...msg,
              proposals: (msg.proposals ?? []).map((p) =>
                p.id === proposalToRevert.proposalId
                  ? { ...p, status: 'pending' as const }
                  : p,
              ),
            }
          : msg,
      ),
    );
  }, [proposalToRevert]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }, []);

  const handleProposalStatusChange = useCallback(
    (
      proposalId: string,
      status: 'approved' | 'rejected',
      project?: ProjectEntity,
    ) => {
      setLocalMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          proposals: (msg.proposals ?? []).map((p) =>
            p.id === proposalId ? { ...p, status } : p,
          ),
        })),
      );
      if (project) {
        onProjectUpdated?.(project);
      }
    },
    [onProjectUpdated],
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
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChatContextBanner context={state.data.context} />
          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
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
            {isStreaming && !streamingContent && <ThinkingBubble />}
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

const ThinkingBubble = () => (
  <div className="flex gap-3">
    <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
      <Bot className="size-4" />
    </div>
    <div className="bg-muted flex items-center gap-1 rounded-xl px-4 py-2.5">
      <span className="size-1.5 animate-bounce rounded-full bg-current opacity-60 [animation-delay:0ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current opacity-60 [animation-delay:150ms]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current opacity-60 [animation-delay:300ms]" />
    </div>
  </div>
);

const SOUL_CONTEXT_LABELS: Partial<Record<ChatContext['type'], string>> = {
  open_question: 'Open Question',
  workstream: 'Workstream',
  assumption: 'Assumption',
  decision: 'Decision',
};

const ChatContextBanner = ({ context }: { context: ChatContext | null }) => {
  if (!context) return null;

  const typeLabel = SOUL_CONTEXT_LABELS[context.type];
  if (!typeLabel) return null;

  return (
    <div className="flex items-center gap-2 border-b px-6 py-2">
      <Badge variant="secondary" className="text-[10px]">
        {typeLabel}
      </Badge>
      {context.label && (
        <span className="text-muted-foreground truncate text-xs">
          {context.label}
        </span>
      )}
    </div>
  );
};
