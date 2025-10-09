import { useState } from 'react';

import { MilestoneActions } from '@/modules/milestones/components/MilestoneActions';
import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';

export const MilestoneCard = ({
  phase,
  milestone,
  onUpdated,
}: {
  phase: PhaseEntity;
  milestone: MilestoneEntity;
  onUpdated: (milestone: MilestoneEntity) => void;
}) => {
  const [currentMilestone, setCurrentMilestone] = useState(milestone);
  return (
    <Card key={currentMilestone.id} className={'gap-0 p-4'}>
      <div className={'flex items-start justify-between'}>
        <div className={'text-lg font-semibold'}>{currentMilestone.title}</div>
        <Badge
          className={'mt-1'}
          variant={
            currentMilestone.status === 'inProgress' ? 'warning' : 'default'
          }
        >
          {currentMilestone.status}
        </Badge>
      </div>
      <div className={'text-muted-foreground mb-2'}>
        {currentMilestone.description}
      </div>
      <div className={'flex items-center gap-1'}>
        <b className={'text-sm'}>Estimation:</b>
        <Badge>{currentMilestone.daysNeeded} days</Badge>
      </div>

      <Separator className={'my-2'} />
      <div className={'mb-2 flex flex-col gap-1'}>
        <b>Definition of done:</b>
        <p>{currentMilestone.definitionOfDone}</p>
      </div>

      {phase.status === 'inProgress' && (
        <MilestoneActions
          milestone={currentMilestone}
          onUpdated={(milestone) => {
            setCurrentMilestone(milestone);
            onUpdated(milestone);
          }}
        />
      )}

      {/*<TasksBlock milestone={milestone} />*/}
    </Card>
  );
};
