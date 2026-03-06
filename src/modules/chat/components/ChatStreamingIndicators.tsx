import { Link } from 'react-router';

import {
  ArrowRight,
  Bot,
  CheckSquare,
  EqualApproximately,
  FileSearch,
  Flag,
  ListTodo,
  PersonStanding,
  Route,
  Search,
  Sparkles,
  Swords,
  Unlock,
  Users,
  Wrench,
} from 'lucide-react';

import type { ProposalProgressStage } from '@/modules/chat/api/sendChatMessage';
import type { UnlockedSection } from '@/modules/chat/types/entity';

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
    unlock_section: { label: 'Unlocking section', icon: Unlock },
    load_competitors: { label: 'Loading competitors', icon: Swords },
    load_auditory: { label: 'Loading audience data', icon: Users },
    update_competitors: { label: 'Updating competitor', icon: Swords },
    update_auditory: { label: 'Updating audience data', icon: Users },
    complete_step: { label: 'Completing step', icon: CheckSquare },
    complete_milestone: { label: 'Completing milestone', icon: Flag },
    update_milestone: { label: 'Updating milestone', icon: Flag },
    update_step: { label: 'Updating step', icon: CheckSquare },
    complete_task: { label: 'Completing task', icon: CheckSquare },
    update_task: { label: 'Updating task', icon: CheckSquare },
  };

const PROPOSAL_STAGE_CONFIG: Record<
  ProposalProgressStage,
  { label: string; icon: typeof Search }
> = {
  analyzing: { label: 'Analyzing current plan', icon: FileSearch },
  generating_changes: { label: 'Generating changes', icon: Wrench },
};

const SECTION_CONFIG: Record<
  UnlockedSection,
  { label: string; icon: typeof Search; description: string }
> = {
  competitors: {
    label: 'Competitors',
    icon: EqualApproximately,
    description: 'Competitor analysis is now available',
  },
  auditory: {
    label: 'Audience',
    icon: PersonStanding,
    description: 'Audience analysis is now available',
  },
};

export const SectionUnlockedCard = ({
  section,
  projectId,
}: {
  section: UnlockedSection;
  projectId: string;
}) => {
  const config = SECTION_CONFIG[section];
  const Icon = config.icon;

  return (
    <div className="flex gap-3">
      <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
        <Bot className="size-4" />
      </div>
      <Link
        to={`/project/${projectId}/${section === 'competitors' ? 'competitors' : 'auditory'}`}
        className="border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10 flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
      >
        <div className="bg-primary/15 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{config.label} unlocked</span>
          <span className="text-muted-foreground text-xs">
            {config.description}
          </span>
        </div>
        <ArrowRight className="text-muted-foreground ml-2 size-4" />
      </Link>
    </div>
  );
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
