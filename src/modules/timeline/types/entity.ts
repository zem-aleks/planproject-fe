import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';

export type TimelinePointEntity = {
  id: string;
  projectId: string;
  projectDay: number;
  date: string;
  createdAt: Date;
  updatedAt: Date;
  events: TimelineEventHydrated[];
};

export type TimelineEventMilestone =
  | {
      type: 'milestone.started';
      milestoneId: string;
      comment: string;
      startedAt: Date;
    }
  | {
      type: 'milestone.continue';
      milestoneId: string;
      comment: string;
      createdAt: Date;
    }
  | { type: 'milestone.completed'; milestoneId: string; completedAt: Date };

export type TimelineEventPhase =
  | { type: 'phase.started'; phaseId: string }
  | { type: 'phase.completed'; phaseId: string };

export type TimelineEventProject =
  | { type: 'project.started'; projectId: string }
  | { type: 'project.completed'; projectId: string };

export type TimelineEventFocus = {
  type: 'focus.changed';
  milestoneIds: string[];
  milestoneTitles: string[];
  createdAt: string;
};

export type TimelineEventSoul = {
  type: 'soul.updated';
  description: string;
  createdAt: string;
};

export type TimelineEventChat = {
  type: 'chat.created';
  chatId: string;
  chatName: string | null;
  contextType: string | null;
  contextLabel: string | null;
  createdAt: string;
};

export type TimelineEventTask = {
  type: 'task.completed';
  taskId: string;
  taskTitle: string;
  milestoneId: string;
  message: string;
  completedAt: string;
};

export type TimelineEvent =
  | TimelineEventMilestone
  | TimelineEventPhase
  | TimelineEventProject
  | TimelineEventFocus
  | TimelineEventSoul
  | TimelineEventChat
  | TimelineEventTask;

export type TimelineEventHydrated =
  | (TimelineEventMilestone & { milestone: MilestoneDetailsEntity })
  | (TimelineEventPhase & { phase: PhaseEntity })
  | (TimelineEventProject & { project: ProjectEntity })
  | TimelineEventFocus
  | TimelineEventSoul
  | TimelineEventChat
  | TimelineEventTask;
