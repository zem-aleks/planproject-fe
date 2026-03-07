import { Bot, User } from 'lucide-react';

import { ProposalCard } from '@/modules/chat/components/ProposalCard';
import type { ChatMessage, ChatProposal } from '@/modules/chat/types/entity';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';

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
    project?: ProjectEntity,
  ) => void;
}) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex flex-row-reverse gap-2 md:gap-3">
        <div className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full md:size-8">
          <User className="size-3 md:size-4" />
        </div>
        <div className="bg-primary text-primary-foreground max-w-[85%] min-w-0 overflow-hidden rounded-xl px-3 py-2 text-sm leading-relaxed md:max-w-[80%] md:px-4 md:py-2.5">
          <p className="break-words whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs">
        <Bot className="size-3.5" />
        <span>AI</span>
      </div>
      <div className="bg-muted min-w-0 overflow-hidden rounded-xl px-3 py-2 text-sm leading-relaxed md:px-4 md:py-2.5">
        <div className="prose-sm max-w-none overflow-hidden break-words">
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
      </div>
    </div>
  );
};
