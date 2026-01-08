import { ReactNode } from 'react';

import { TimelineMilestoneCard } from '@/modules/milestones/components/TimelineMilestoneCard';
import { getDaySince } from '@/modules/projects/helpers/getDaySince';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { getHistoryTimeline } from '@/modules/timeline/api/getHistoryTimeline';
import { TimelinePointEntity } from '@/modules/timeline/types/entity';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable.ts';
import { useLoadableData } from '@/utils/useLoadableData';

type Props = {
  project: ProjectEntity;
};

export const HistoryTimelineLoader = ({ project }: Props): ReactNode => {
  const { state, reload } = useLoadableData(getHistoryTimeline, project.id);
  const projectDay = getDaySince(project.startedAt);
  const days = Array.from({ length: projectDay }, (_, i) => projectDay - i);

  switch (state.type) {
    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>History loading error</p>
          <p className={'pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </Card>
      );

    case 'loading':
    case 'loaded':
      return (
        <Card className={'p-4 py-1'}>
          <Accordion type="multiple">
            {days.map((day, index) => (
              <AccordionItem value={`day-${day}`}>
                <AccordionTrigger className={'items-center'}>
                  <div>
                    <div className={'flex items-center gap-2 text-2xl'}>
                      {state.type === 'loading' && <Spinner />} Day {day}{' '}
                      {index === 0 && <>(today)</>}
                    </div>
                    {state.type === 'loaded' && (
                      <div className={'text-muted-foreground no-underline'}>
                        {state.data.find((t) => t.projectDay === day)
                          ?.milestones.length ?? 0}{' '}
                        milestone(s)
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <DayContent
                    projectStartDate={project.startedAt}
                    projectDay={day}
                    state={
                      state.type === 'loading'
                        ? { type: 'loading' }
                        : {
                            type: 'loaded',
                            data:
                              state.data.find((t) => t.projectDay === day) ||
                              null,
                          }
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      );

    default:
      return notReachable(state);
  }
};

type DayContentState =
  | { type: 'loading' }
  | { type: 'loaded'; data: TimelinePointEntity | null };

const DayContent = ({
  state,
  projectDay,
  projectStartDate,
}: {
  state: DayContentState;
  projectDay: number;
  projectStartDate: Date;
}) => {
  switch (state.type) {
    case 'loading':
      return (
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      );

    case 'loaded':
      if (!state.data) {
        return (
          <div className={'text-muted-foreground'}>
            It looks like you had no activity this day or you was focused on the
            previous day tasks
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-4">
          {state.data.milestones.map((milestone) => (
            <TimelineMilestoneCard
              milestone={milestone}
              projectDay={projectDay}
              projectStartDate={projectStartDate}
            />
          ))}
        </div>
      );

    default:
      return notReachable(state);
  }
};
