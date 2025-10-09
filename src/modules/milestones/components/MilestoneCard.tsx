import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';

// export type Msg = { type: 'onPhaseUpdated' } | { type: 'onOpenClicked' };

export const MilestoneCard = ({
  phase,
  milestone,
  // onMsg,
}: {
  phase: PhaseEntity;
  milestone: MilestoneEntity;
  // onMsg: (msg: Msg) => void;
}) => {
  return (
    <Card key={milestone.id} className={'gap-0 p-4'}>
      <div className={'flex items-start justify-between'}>
        <div className={'text-lg font-semibold'}>{milestone.title}</div>
        <Badge className={'mt-1'}>{milestone.status}</Badge>
      </div>
      <div className={'text-muted-foreground mb-2'}>
        {milestone.description}
      </div>
      <div className={'flex items-center gap-1'}>
        <b className={'text-sm'}>Estimation:</b>
        <Badge>{milestone.daysNeeded} days</Badge>
      </div>

      <Separator className={'my-2'} />
      <div className={'flex flex-col gap-1'}>
        <b>Definition of done:</b>
        <p>{milestone.definitionOfDone}</p>
      </div>

      {phase.status === 'inProgress' && milestone.status === 'notStarted' && (
        <Button className={'mt-2'}>Start working on it now</Button>
      )}

      {/*<TasksBlock milestone={milestone} />*/}
    </Card>
  );
};
