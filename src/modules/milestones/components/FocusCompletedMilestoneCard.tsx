import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import dayjs from 'dayjs';

import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';

export const FocusCompletedMilestoneCard = ({
  milestone,
}: {
  milestone: MilestoneDetailsEntity;
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
          Completed
        </Badge>
      </div>

      <Button variant="warning" className={'w-full py-2'} asChild>
        <Link
          to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
          className="w-full"
        >
          View Details
        </Link>
      </Button>

      {/*<TasksBlock milestone={milestone} />*/}
    </Card>
  );
};
