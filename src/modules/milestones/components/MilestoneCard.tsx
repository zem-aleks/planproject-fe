import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { PhaseEntity } from '@/modules/phases/types/entity';

// export type Msg = { type: 'onPhaseUpdated' } | { type: 'onOpenClicked' };

export const MilestoneCard = ({
  // phase,
  milestone,
  // onMsg,
}: {
  phase: PhaseEntity;
  milestone: MilestoneEntity;
  // onMsg: (msg: Msg) => void;
}) => {
  return (
    <div key={milestone.id} className={'rounded border p-2'}>
      <div className={'text-lg font-semibold'}>{milestone.title}</div>
      <div className={'text-muted-foreground'}>{milestone.description}</div>
      <div className={'text-sm'}>
        Estimation: {milestone.daysNeeded}
        days
      </div>
      <div className={'text-sm'}>
        Definition of done: {milestone.definitionOfDone}
      </div>
    </div>
  );
};
