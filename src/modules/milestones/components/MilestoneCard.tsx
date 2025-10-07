import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Separator } from '@/ui/separator';

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
      <div className={'text-muted-foreground mb-2'}>
        {milestone.description}
      </div>
      <div className={'text-sm'}>
        <b>Estimation:</b> {milestone.daysNeeded}
        days
      </div>

      <Separator className={'my-2'} />
      <div className={'flex flex-col gap-1'}>
        <b>Definition of done:</b>
        <p>{milestone.definitionOfDone}</p>
      </div>

      {/*<TasksBlock milestone={milestone} />*/}
    </div>
  );
};
