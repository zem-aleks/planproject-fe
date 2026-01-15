import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { CompleteMilestoneForm } from '@/modules/milestones/components/CompleteMilestoneForm';
import {
  MilestoneDetailsEntity,
  MilestoneEntity,
} from '@/modules/milestones/types/entity';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { Separator } from '@/ui/separator';

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
    <Card key={currentMilestone.id} className={'justify-between gap-4 p-4'}>
      {/*{milestone.status === 'inProgress' && (*/}
      {/*  <DaysCounter*/}
      {/*    startedAt={milestone.startedAt}*/}
      {/*    daysCount={milestone.daysNeeded}*/}
      {/*  />*/}
      {/*)}*/}

      <div className={'mb-2 flex items-start justify-between'}>
        <div>
          <div className={'text-lg font-semibold'}>
            {currentMilestone.title}
          </div>
          <div className={'text-muted-foreground flex h-5 items-center gap-4'}>
            <span>{currentMilestone.phase.title}</span>
            <Separator orientation={'vertical'} className={'h-4'} />
            <span>Milestone {currentMilestone.orderIndex}</span>
            <Separator orientation={'vertical'} className={'h-4'} />
            <span>
              Day {dayjs().diff(currentMilestone.startedAt, 'days') + 1} out of{' '}
              {currentMilestone.daysNeeded}
            </span>
          </div>
        </div>
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
        {/*<div className={'flex items-center gap-1'}>*/}
        {/*  <b>Estimation:</b>*/}
        {/*  <Badge>{milestone.daysNeeded} days</Badge>*/}
        {/*</div>*/}
      </div>

      <div className={'flex flex-col gap-4'}>
        <div className={'rounded-lg border-2 border-green-600 p-2 px-4'}>
          <b className={''}>Definition of done:</b>{' '}
          <span>{milestone.definitionOfDone}</span>
        </div>

        {milestone.steps && (
          <Card className={'w-full gap-2 p-4'}>
            <div className={'font-semibold'}>Steps:</div>
            <MarkdownFormat>{milestone.steps}</MarkdownFormat>
          </Card>
        )}
        {milestone.usefulResources && (
          <Card className={'w-full gap-2 p-4'}>
            <div className={'font-semibold'}>Useful resources:</div>
            <MarkdownFormat>{milestone.usefulResources}</MarkdownFormat>
          </Card>
        )}
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
