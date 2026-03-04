import { useCallback, useEffect, useRef, useState } from 'react';

import type { AxiosError } from 'axios';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/queryKeys';
import { getChat } from '@/modules/chat/api/getChat';
import { ChatInput } from '@/modules/chat/components/ChatInput';
import { ChatMessageBubble } from '@/modules/chat/components/ChatMessageBubble';
import {
  ThinkingBubble,
  ToolCallBubble,
} from '@/modules/chat/components/ChatStreamingIndicators';
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
import { useQuery, useQueryClient } from '@tanstack/react-query';

export type ProposalRevert = {
  messageId: string;
  proposalId: string;
};

export const ChatConversation = ({
  projectId,
  chatId,
  initialMessage,
  onChatNameChange,
  onProjectUpdated,
  proposalToRevert,
}: {
  projectId: string;
  chatId: string;
  initialMessage?: string | null;
  onChatNameChange?: (name: string) => void;
  onProjectUpdated?: (project: ProjectEntity) => void;
  proposalToRevert?: ProposalRevert | null;
}) => {
  const queryClient = useQueryClient();
  const { data, status, dataUpdatedAt } = useQuery<
    ChatEntity,
    AxiosError<Error>
  >({
    queryKey: queryKeys.chats.detail(chatId),
    queryFn: ({ signal }) => getChat({ projectId, chatId }, { signal }),
  });
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingProposals, setStreamingProposals] = useState<ChatProposal[]>(
    [],
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset local state when chat data is fetched/refetched
  useEffect(() => {
    if (status === 'success') {
      setLocalMessages(data!.messages);
      setStreamingContent('');
      setStreamingProposals([]);
    }
  }, [dataUpdatedAt]);

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

  const { sendMessage, isStreaming, toolCallName, proposalStage, abort } =
    useChatStream({
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
        queryClient.invalidateQueries({
          queryKey: queryKeys.chats.detail(chatId),
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

  // Auto-send initial message when chat loads empty
  const initialMessageSent = useRef(false);
  useEffect(() => {
    if (
      initialMessage &&
      !initialMessageSent.current &&
      status === 'success' &&
      data!.messages.length === 0
    ) {
      initialMessageSent.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage, status]);

  switch (status) {
    case 'pending':
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

    case 'success':
      return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChatContextBanner context={data!.context} />
          <div
            ref={scrollRef}
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
          >
            {localMessages.length === 0 && !isStreaming && (
              <ChatSuggestions context={data!.context} onSelect={sendMessage} />
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
            {isStreaming &&
              !streamingContent &&
              !toolCallName &&
              !proposalStage && <ThinkingBubble />}
            {isStreaming &&
              !streamingContent &&
              (toolCallName || proposalStage) && (
                <ToolCallBubble
                  name={toolCallName}
                  proposalStage={proposalStage}
                />
              )}
            {isStreaming && streamingContent && (
              <>
                <ChatMessageBubble
                  message={{
                    id: 'streaming',
                    role: 'assistant',
                    content: streamingContent,
                    proposals: [],
                    createdAt: new Date().toISOString(),
                  }}
                  isStreaming={!toolCallName && !proposalStage}
                  proposals={streamingProposals}
                  projectId={projectId}
                  chatId={chatId}
                  onProposalStatusChange={handleProposalStatusChange}
                />
                {(toolCallName || proposalStage) && (
                  <ToolCallBubble
                    name={toolCallName}
                    proposalStage={proposalStage}
                  />
                )}
              </>
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
      return notReachable(status);
  }
};

const ALL_SUGGESTIONS: Partial<Record<ChatContext['type'], string[]>> = {
  open_question: [
    'Review all open questions and their impact',
    'Check if there are other questions we should consider',
    "What's the current status of unresolved questions?",
  ],
  assumption: [
    'Review current assumptions and their risks',
    'Are there assumptions we should validate first?',
    'Which assumptions have the highest impact?',
  ],
  workstream: [
    'Summarize progress across all workstreams',
    'Which workstreams need attention right now?',
    'Are there dependencies between workstreams?',
  ],
  decision: [
    'Review recent decisions and their rationale',
    'Are there pending decisions blocking progress?',
    'What decisions should we revisit?',
  ],
  desired_outcome: [
    'How are we tracking against desired outcomes?',
    'Which outcomes are at risk of not being met?',
    'Should we adjust any of our success criteria?',
  ],
  constraint: [
    'Review current constraints and their impact',
    'Are any constraints blocking critical work?',
    'Which constraints should we try to relax?',
  ],
  resource: [
    'Are we using our resources effectively?',
    'What tools or resources are we missing?',
    'Review resource allocation across workstreams',
  ],
  target_user: [
    'Review our target user segments',
    'Are we missing any important user groups?',
    "How well do we understand our users' needs?",
  ],
  project_context: [
    'Summarize the current project state',
    'What has changed since the last review?',
    'Are there domain insights we should act on?',
  ],
};

const SPECIFIC_SUGGESTIONS: Partial<Record<ChatContext['type'], string[]>> = {
  open_question: [
    'Help me answer this question',
    'What information do we need to resolve this?',
    'What are the possible answers and trade-offs?',
  ],
  assumption: [
    'How can we validate this assumption?',
    'What happens if this assumption is wrong?',
    'What evidence supports or contradicts this?',
  ],
  workstream: [
    'Break down the next steps for this workstream',
    'What are the blockers for this workstream?',
    'How does this workstream connect to others?',
  ],
  decision: [
    'Walk me through the reasoning behind this decision',
    'What alternatives were considered?',
    'Should we reconsider this decision given current context?',
  ],
  desired_outcome: [
    'How do we measure progress toward this outcome?',
    'What are the risks to achieving this outcome?',
    'Is this outcome still relevant and well-scoped?',
  ],
  constraint: [
    'How does this constraint affect our plan?',
    'Is there a way to work around this constraint?',
    'Should we challenge this constraint?',
  ],
  resource: [
    'How are we using this resource currently?',
    'Are we getting the most value from this resource?',
    'What would happen if we lost this resource?',
  ],
  target_user: [
    'What do we know about this user segment?',
    'What are their biggest pain points?',
    'How well does our solution serve this user?',
  ],
  project_context: [
    'How does this context affect our planning?',
    'What actions should we take based on this?',
    'Is this context still accurate?',
  ],
};

const DEFAULT_SUGGESTIONS = [
  'What should I focus on next?',
  'Give me a project status overview',
  'What are the biggest risks right now?',
];

const ChatSuggestions = ({
  context,
  onSelect,
}: {
  context: ChatContext | null;
  onSelect: (message: string) => void;
}) => {
  const suggestionsMap = context?.entityId
    ? SPECIFIC_SUGGESTIONS
    : ALL_SUGGESTIONS;
  const suggestions =
    (context && suggestionsMap[context.type]) || DEFAULT_SUGGESTIONS;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <MessageCircle className="size-8 opacity-50" />
        <p className="text-sm">Start a conversation</p>
      </div>
      <div className="flex flex-col gap-2">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onSelect(text)}
            className="border-border hover:border-primary/40 hover:bg-muted rounded-lg border px-4 py-2.5 text-left text-sm transition-colors"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
};

const SOUL_CONTEXT_LABELS: Partial<Record<ChatContext['type'], string>> = {
  open_question: 'Open Question',
  workstream: 'Workstream',
  assumption: 'Assumption',
  decision: 'Decision',
  desired_outcome: 'Desired Outcome',
  constraint: 'Constraint',
  resource: 'Resource',
  target_user: 'Target User',
  project_context: 'Project Context',
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
