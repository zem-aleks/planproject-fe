import { useCallback, useEffect, useRef, useState } from 'react';

import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/queryKeys';
import { createChat } from '@/modules/chat/api/createChat';
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
  ChatMessage,
  ChatProposal,
} from '@/modules/chat/types/entity';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Spinner } from '@/ui/spinner';
import { useQueryClient } from '@tanstack/react-query';

export const MilestoneChatDialog = ({
  projectId,
  context,
  chatId: existingChatId,
  initialMessage,
  open,
  onClose,
}: {
  projectId: string;
  context: ChatContext;
  chatId?: string | null;
  initialMessage?: string | null;
  open: boolean;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const initialMessageSentRef = useRef(false);
  const [chatId, setChatId] = useState<string | null>(existingChatId ?? null);
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

    initialMessageSentRef.current = false;
    setLoading(true);
    setMessages([]);
    setStreamingContent('');
    setStreamingProposals([]);

    if (existingChatId) {
      setChatId(existingChatId);
      getChat({ projectId, chatId: existingChatId })
        .then((chat) => {
          setMessages(chat.messages);
        })
        .catch(() => {
          toast.error('Failed to load chat');
          onClose();
        })
        .finally(() => setLoading(false));
    } else {
      setChatId(null);
      createChat(projectId, context)
        .then((chat) => {
          setChatId(chat.id);
          queryClient.invalidateQueries({
            queryKey: queryKeys.chats.byProject(projectId),
          });
        })
        .catch(() => {
          toast.error('Failed to create chat');
          onClose();
        })
        .finally(() => setLoading(false));
    }
  }, [open, projectId, existingChatId, context, onClose, queryClient]);

  const { sendMessage, isStreaming, abort, toolCallName, proposalStage } =
    useChatStream({
      projectId,
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

  // Auto-send initial message for new chats
  useEffect(() => {
    if (
      initialMessage &&
      !initialMessageSentRef.current &&
      chatId &&
      !loading &&
      !existingChatId
    ) {
      initialMessageSentRef.current = true;
      sendMessage(initialMessage);
    }
  }, [initialMessage, chatId, loading, existingChatId, sendMessage]);

  const handleProposalStatusChange = useCallback(
    (proposalId: string, status: 'approved' | 'rejected') => {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          proposals: (msg.proposals ?? []).map((p) =>
            p.id === proposalId ? { ...p, status } : p,
          ),
        })),
      );
    },
    [],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="flex h-[95vh] flex-col gap-0 p-0 sm:max-w-4xl"
        showCloseButton
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="size-5" />
            Chat — {context.label}
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
                  <p className="text-sm">Send a message to start chatting</p>
                </div>
              )}
              {messages.map((msg) => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  proposals={msg.proposals}
                  projectId={projectId}
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
                    projectId={projectId}
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
