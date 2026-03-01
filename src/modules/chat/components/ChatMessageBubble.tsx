import { Bot, User } from 'lucide-react';

import { ProposalCard } from '@/modules/chat/components/ProposalCard';
import type { ChatMessage, ChatProposal } from '@/modules/chat/types/entity';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { cn } from '@/ui/lib/utils';

export const ChatMessageBubble = ({
  message,
  isStreaming,
  proposals,
  projectId,
  chatId,
  onProposalStatusChange,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
  proposals?: ChatProposal[];
  projectId?: string;
  chatId?: string;
  onProposalStatusChange?: (
    proposalId: string,
    status: 'approved' | 'rejected',
  ) => void;
}) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full',
          isUser
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary/10 text-primary',
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div
        className={cn(
          'max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        {isUser ? (
          message.content
        ) : (
          <div className="prose-sm">
            <MarkdownFormat>{message.content}</MarkdownFormat>
            {proposals?.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                projectId={projectId!}
                chatId={chatId!}
                onStatusChange={onProposalStatusChange!}
              />
            ))}
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-current align-text-bottom" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
