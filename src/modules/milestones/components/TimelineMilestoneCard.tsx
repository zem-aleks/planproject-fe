import { Link } from 'react-router';

import dayjs from 'dayjs';

import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';

export const TimelineMilestoneCard = ({
  milestone,
  projectDay,
  projectStartDate,
}: {
  milestone: MilestoneDetailsEntity;
  projectDay: number;
  projectStartDate: Date;
}) => {
  // console.log(projectDay, getDaySince(milestone.startedAt));
  const startedAtProjectDay =
    dayjs(milestone.startedAt).diff(projectStartDate, 'day') + 1; // if started when project is started, it means day 1

  const completedAtProjectDay =
    dayjs(milestone.completedAt).diff(projectStartDate, 'day') + 1; // if started when project is started, it means day 1

  const daysTook = completedAtProjectDay - startedAtProjectDay + 1;
  const expectationDiff = milestone.daysNeeded - daysTook;

  return (
    <Card
      key={milestone.id}
      className={'flex-row justify-between gap-4 p-2 px-4'}
    >
      {/*{milestone.status === 'inProgress' && (*/}
      {/*  <DaysCounter*/}
      {/*    startedAt={milestone.startedAt}*/}
      {/*    daysCount={milestone.daysNeeded}*/}
      {/*  />*/}
      {/*)}*/}

      <div className={'w-full'}>
        <div className={'text-lg font-semibold'}>{milestone.title}</div>
        <div className={'text-muted-foreground flex h-5 items-center gap-4'}>
          <span>{milestone.phase.title}</span>
          <Separator orientation={'vertical'} className={'h-4'} />
          <span>Milestone {milestone.orderIndex}</span>
        </div>

        <Button variant="warning" size={'sm'} className={'mt-4'} asChild>
          <Link
            to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
            className={'w-full'}
          >
            View Details
          </Link>
        </Button>
      </div>

      <div className={'flex flex-col items-end gap-1'}>
        <Badge className={'mt-1'}>
          {projectDay === startedAtProjectDay
            ? 'Milestone was started'
            : 'Continue working on it'}
        </Badge>

        {projectDay === completedAtProjectDay && (
          <>
            <div className={'w-full text-center'}>- and -</div>
            <Badge
              className={'mt-1 flex flex-col gap-1'}
              variant={expectationDiff >= 0 ? 'success' : 'destructive'}
            >
              <div>Milestone was closed</div>
              {expectationDiff !== 0 && (
                <div className={'text-lg'}>
                  {expectationDiff >= 0
                    ? `${expectationDiff} days faster`
                    : `${-expectationDiff} days delayed`}
                </div>
              )}
            </Badge>
          </>
        )}
      </div>
    </Card>
  );
};
