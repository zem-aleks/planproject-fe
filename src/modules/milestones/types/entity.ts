import { PhaseEntity } from '@/modules/phases/types/entity';
import { TaskEntity } from '@/modules/tasks/types/entity';

export type MilestoneEntity = {
  id: string;
  phaseId: string;
  projectId: string;
  userId: string;
  title: string;
  description: string;
  definitionOfDone: string;
  daysNeeded: number;
  orderIndex: number;
  status: MilestoneStatus;
  startedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type MilestoneStatus = 'notStarted' | 'inProgress' | 'completed';

export type MilestoneWithTasksEntity = MilestoneEntity & {
  tasks: TaskEntity[];
  phase: PhaseEntity;
};
