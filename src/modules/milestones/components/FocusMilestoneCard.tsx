import { useEffect, useState } from 'react';

import { CompleteMilestoneForm } from '@/modules/milestones/components/CompleteMilestoneForm';
import {
  MilestoneDetailsEntity,
  MilestoneEntity,
} from '@/modules/milestones/types/entity';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';

export const FocusMilestoneCard = ({
  milestone,
  onUpdated,
}: {
  milestone: MilestoneDetailsEntity;
  onUpdated: (milestone: MilestoneEntity) => void;
}) => {
  const [currentMilestone, setCurrentMilestone] = useState(milestone);

  useEffect(() => {
    setCurrentMilestone(milestone);
  }, [milestone]);

  return (
    <Card key={currentMilestone.id} className={'justify-between gap-2 p-4'}>
      {milestone.status === 'inProgress' && (
        <DaysCounter
          startedAt={milestone.startedAt}
          daysCount={milestone.daysNeeded}
        />
      )}

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

      <div className={'flex flex-col gap-2'}>
        <div className={''}>{milestone.description}</div>
        <div className={'flex items-center gap-1'}>
          <b>Estimation:</b>
          <Badge>{milestone.daysNeeded} days</Badge>
        </div>
      </div>

      <div className={'flex flex-col gap-2'}>
        <div className={'rounded-lg bg-green-600 p-2 px-4 text-gray-50'}>
          <b className={'text-gray-50'}>Definition of done:</b>{' '}
          <span>{milestone.definitionOfDone}</span>
        </div>

        <Card className={'w-full gap-2 p-4'}>
          <div className={'font-semibold'}>Steps:</div>
          <MarkdownFormat>{milestone.steps}</MarkdownFormat>
        </Card>
        <Card className={'w-full gap-2 p-4'}>
          <div className={'font-semibold'}>Useful resources:</div>
          <MarkdownFormat>{milestone.usefulResources}</MarkdownFormat>
        </Card>
      </div>

      <div className={'flex flex-col gap-2'}>
        {milestone.status !== 'completed' && (
          <CompleteMilestoneForm milestone={milestone} onUpdate={onUpdated} />
        )}
      </div>

      {/*<TasksBlock milestone={milestone} />*/}
    </Card>
  );
};
