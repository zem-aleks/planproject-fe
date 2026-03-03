import { useCallback, useEffect, useRef, useState } from 'react';

import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { createChat } from '@/modules/chat/api/createChat';
import { ChatInput } from '@/modules/chat/components/ChatInput';
import { ChatMessageBubble } from '@/modules/chat/components/ChatMessageBubble';
import { useChatStream } from '@/modules/chat/helpers/useChatStream';
import type { ChatMessage, ChatProposal } from '@/modules/chat/types/entity';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Spinner } from '@/ui/spinner';

export const BrainstormForm = ({
  project,
  onSoulChanged,
}: {
  project: ProjectPreviewEntity;
  onSoulChanged: () => void;
}) => {
  const [open, setOpen] = useState(false);
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

  // Create a fresh chat when dialog opens
  useEffect(() => {
    if (!open) return;

    hadApprovalsRef.current = false;
    setLoading(true);
    setMessages([]);
    setStreamingContent('');
    setStreamingProposals([]);
    setChatId(null);

    createChat(project.id)
      .then((chat) => {
        setChatId(chat.id);
      })
      .catch(() => {
        toast.error('Failed to create chat');
        setOpen(false);
      })
      .finally(() => setLoading(false));
  }, [open, project.id]);

  const handleProposalStatusChange = useCallback(
    (
      proposalId: string,
      status: 'approved' | 'rejected',
      // _project?: ProjectEntity,
    ) => {
      if (status === 'approved') {
        hadApprovalsRef.current = true;
        onSoulChanged();
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
    [onSoulChanged],
  );

  const { sendMessage, isStreaming, abort } = useChatStream({
    projectId: project.id,
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
        if (!value && hadApprovalsRef.current) {
          onSoulChanged();
        }
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          <MessageCircle className="size-4" />
          Discover
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex h-[95vh] flex-col gap-0 p-0 sm:max-w-4xl"
        showCloseButton
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="size-5" />
            Brainstorm — {project.title}
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
                    Send a message to start brainstorming
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <ChatMessageBubble
                  key={msg.id}
                  message={msg}
                  proposals={msg.proposals}
                  projectId={project.id}
                  chatId={chatId!}
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
                  projectId={project.id}
                  chatId={chatId!}
                  onProposalStatusChange={handleProposalStatusChange}
                />
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
