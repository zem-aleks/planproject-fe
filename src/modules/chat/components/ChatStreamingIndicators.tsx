import {
  Bot,
  FileSearch,
  Flag,
  ListTodo,
  Route,
  Search,
  Sparkles,
  Wrench,
} from 'lucide-react';

import type { ProposalProgressStage } from '@/modules/chat/api/sendChatMessage';

export const ThinkingBubble = () => (
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

const TOOL_CALL_CONFIG: Record<string, { label: string; icon: typeof Search }> =
  {
    search_chats: { label: 'Searching chats', icon: Search },
    load_phases: { label: 'Loading phases', icon: Route },
    load_milestones: { label: 'Loading milestones', icon: Flag },
    propose_plan_update: { label: 'Preparing suggestion', icon: Sparkles },
    generate_plan: { label: 'Generating plan', icon: ListTodo },
  };

const PROPOSAL_STAGE_CONFIG: Record<
  ProposalProgressStage,
  { label: string; icon: typeof Search }
> = {
  analyzing: { label: 'Analyzing current plan', icon: FileSearch },
  generating_changes: { label: 'Generating changes', icon: Wrench },
};

export const ToolCallBubble = ({
  name,
  proposalStage,
}: {
  name: string | null;
  proposalStage: ProposalProgressStage | null;
}) => {
  const stageConfig = proposalStage
    ? PROPOSAL_STAGE_CONFIG[proposalStage]
    : null;
  const toolConfig = name ? TOOL_CALL_CONFIG[name] : undefined;
  const Icon = stageConfig?.icon ?? toolConfig?.icon ?? Search;
  const label = stageConfig?.label ?? toolConfig?.label ?? 'Thinking';

  return (
    <div className="flex gap-3">
      <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
        <Bot className="size-4" />
      </div>
      <div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm">
        <Icon className="size-3.5 animate-pulse" />
        <span>{label}&#8230;</span>
      </div>
    </div>
  );
};
