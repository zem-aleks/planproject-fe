import { ReactNode } from 'react';

import dayjs from 'dayjs';
import { Flag, Goal } from 'lucide-react';

import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { getHistoryTimeline } from '@/modules/timeline/api/getHistoryTimeline';
import {
  TimelineDot,
  TimelineLine,
} from '@/modules/timeline/components/Timeline';
import { TimelineEventHydrated } from '@/modules/timeline/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable.ts';
import { useLoadableData } from '@/utils/useLoadableData';
import { IconCheck, IconCompass, IconProgress } from '@tabler/icons-react';

type Props = {
  project: ProjectPreviewEntity;
};

export const HistoryTimelineLoader = ({ project }: Props): ReactNode => {
  const { state, reload } = useLoadableData(getHistoryTimeline, project.id);

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
      return <Skeleton className="h-[500px] w-full rounded-xl" />;

    case 'loaded': {
      const events = state.data.filter((p) => p.events.length > 0);
      if (events.length === 0) {
        return (
          <Card className={'flex flex-col items-center gap-2 py-4'}>
            <p className={'text-xl'}>Nothing happened yet</p>
          </Card>
        );
      }
      return (
        <div
          className={
            'flex w-full flex-col items-start justify-center gap-4 pb-96'
          }
        >
          {events.map((point) => (
            <div className={'flex items-end gap-8'}>
              <div
                className={
                  'mt-20 flex h-16 w-16 shrink-0 translate-y-1/3 flex-col items-center justify-center rounded-md bg-gray-50 shadow shadow-pink-900 sm:w-30'
                }
              >
                <div className={'font-semibold'}>Day {point.projectDay}</div>
                <div className={'text-foreground text-center text-sm'}>
                  {dayjs(point.createdAt).format('D MMM YYYY')}
                </div>
              </div>
              <div
                className={
                  'flex h-full grow flex-col items-center justify-center gap-4'
                }
              >
                <TimelineLine />
                <TimelineDot />
              </div>
              <EventsCard events={point.events} />
            </div>
          ))}
        </div>
      );
    }

    default:
      return notReachable(state);
  }
};

const EventsCard = ({ events }: { events: TimelineEventHydrated[] }) => {
  return (
    <div
      className={
        'mt-20 grow translate-y-1/3 rounded-md bg-gray-50 px-2 py-2 shadow shadow-pink-900'
      }
    >
      <ul className={'flex flex-col gap-1'}>
        {events.map((event) => (
          <li>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const EventCard = ({ event }: { event: TimelineEventHydrated }) => {
  switch (event.type) {
    case 'milestone.started':
      return (
        <div className={''}>
          <IconCompass className={'mr-1 inline-block text-orange-400'} />
          Milestone <strong>{event.milestone.title}</strong> was started
        </div>
      );

    case 'milestone.continue':
      return (
        <div className={''}>
          <IconProgress className={'mr-1 inline-block text-blue-700'} />
          Milestone <strong>{event.milestone.title}</strong> in progress
        </div>
      );

    case 'milestone.completed':
      return (
        <div className={''}>
          <IconCheck className={'inline-block text-green-600'} /> Milestone{' '}
          <strong>{event.milestone.title}</strong> was completed
        </div>
      );

    case 'phase.started':
      return (
        <div className={''}>
          <IconCompass className={'mr-1 inline-block text-orange-400'} />
          Phase <strong>{event.phase.title}</strong> was started
        </div>
      );

    case 'phase.completed':
      return (
        <div className={''}>
          <IconCheck className={'inline-block text-green-600'} /> Phase{' '}
          <strong>{event.phase.title}</strong> was completed
        </div>
      );

    case 'project.started':
      return (
        <div className={''}>
          <Goal className={'inline-block text-pink-700'} /> Project{' '}
          <strong>{event.project.title}</strong> was started!
        </div>
      );

    case 'project.completed':
      return (
        <div className={''}>
          <Flag className={'inline-block text-green-600'} /> Congratulations!
          You completed the project!
        </div>
      );

    default:
      return notReachable(event);
  }
};
