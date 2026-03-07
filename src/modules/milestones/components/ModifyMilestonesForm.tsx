import { useCallback, useEffect, useRef, useState } from 'react';

import { LockIcon, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useUser } from '@/modules/auth/contexts/UserContext';
import { createChat } from '@/modules/chat/api/createChat';
import { ChatInput } from '@/modules/chat/components/ChatInput';
import { ChatMessageBubble } from '@/modules/chat/components/ChatMessageBubble';
import {
  ThinkingBubble,
  ToolCallBubble,
} from '@/modules/chat/components/ChatStreamingIndicators';
import { useChatStream } from '@/modules/chat/helpers/useChatStream';
import type { ChatMessage, ChatProposal } from '@/modules/chat/types/entity';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { UpgradeSubscriptionModal } from '@/modules/subscriptions/components/UpgradeSubscriptionModal';
import { Button } from '@/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Spinner } from '@/ui/spinner';
import { IconPencil } from '@tabler/icons-react';

export const ModifyMilestonesForm = ({
  phase,
  onModified,
}: {
  phase: PhaseEntity;
  onModified: () => void;
}) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  if (phase.status !== 'notStarted') {
    return null;
  }

  if (!['pro', 'business'].includes(user?.subscription ?? '')) {
    return (
      <>
        <UpgradeSubscriptionModal open={open} onClose={() => setOpen(false)} />
        <Button onClick={() => setOpen(true)} variant={'warning'} size={'sm'}>
          <LockIcon />
          Modify Milestones
        </Button>
      </>
    );
  }

  return (
    <>
      <ModifyMilestonesChat
        open={open}
        onClose={() => setOpen(false)}
        phase={phase}
        onModified={onModified}
      />
      <Button variant={'warning'} onClick={() => setOpen(true)} size={'sm'}>
        <IconPencil /> Modify Phase
      </Button>
    </>
  );
};

const ModifyMilestonesChat = ({
  open,
  phase,
  onClose,
  onModified,
}: {
  phase: PhaseEntity;
  open: boolean;
  onClose: () => void;
  onModified: () => void;
}) => {
  const hadApprovalsRef = useRef(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingProposals, setStreamingProposals] = useState<ChatProposal[]>(
    [],
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }, []);

  useEffect(() => {
    if (!open) return;

    hadApprovalsRef.current = false;
    setLoading(true);
    setMessages([]);
    setStreamingContent('');
    setStreamingProposals([]);
    setChatId(null);

    createChat(phase.projectId, { type: 'phase', entityId: phase.id })
      .then((chat) => setChatId(chat.id))
      .catch(() => {
        toast.error('Failed to create chat');
        onClose();
      })
      .finally(() => setLoading(false));
  }, [open, phase.projectId, phase.id, onClose]);

  const handleProposalStatusChange = useCallback(
    (proposalId: string, status: 'approved' | 'rejected') => {
      if (status === 'approved') {
        hadApprovalsRef.current = true;
        onModified();
      }
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          proposals: (msg.proposals ?? []).map((p) =>
            p.id === proposalId ? { ...p, status } : p,
          ),
        })),
      );
    },
    [onModified],
  );

  const { sendMessage, isStreaming, abort, toolCallName, proposalStage } =
    useChatStream({
      projectId: phase.projectId,
      chatId: chatId ?? '',
      onUserMessage: (msg) => {
        setMessages((prev) => [...prev, msg]);
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
      onAssistantDone: (messageId) => {
        setStreamingContent((prev) => {
          setStreamingProposals((currentProposals) => {
            const finalMessage: ChatMessage = {
              id: messageId,
              role: 'assistant',
              content: prev,
              proposals: currentProposals,
              createdAt: new Date().toISOString(),
            };
            setMessages((msgs) => [...msgs, finalMessage]);
            return [];
          });
          return '';
        });
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
            setMessages((msgs) => [...msgs, partial]);
          }
          return '';
        });
        setStreamingProposals([]);
      },
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          if (hadApprovalsRef.current) {
            onModified();
          }
          onClose();
        }
      }}
      modal
    >
      <DialogContent
        className="flex h-[95vh] flex-col gap-0 p-0 sm:max-w-4xl"
        showCloseButton
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="size-5" />
            Modify Phase — {phase.title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
            >
              {messages.length === 0 && !isStreaming && (
                <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2">
                  <MessageCircle className="size-8 opacity-50" />
                  <p className="text-sm">
                    Describe what you'd like to change about this phase or its
                    milestones
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  proposals={msg.proposals}
                  projectId={phase.projectId}
                  chatId={chatId!}
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
                    projectId={phase.projectId}
                    chatId={chatId!}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
