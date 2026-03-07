import { ReactNode } from 'react';
import { Link } from 'react-router';

import type { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Flag, Focus, Goal, MessageSquare, Sparkles } from 'lucide-react';

import { queryKeys } from '@/lib/queryKeys';
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
import { IconCheck, IconCompass, IconProgress } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';

type TimelinePoint = Awaited<ReturnType<typeof getHistoryTimeline>>;

type Props = {
  project: ProjectPreviewEntity;
};

export const HistoryTimelineLoader = ({ project }: Props): ReactNode => {
  const { data, error, status, refetch } = useQuery<
    TimelinePoint,
    AxiosError<Error>
  >({
    queryKey: queryKeys.timeline.history(project.id),
    queryFn: ({ signal }) => getHistoryTimeline(project.id, { signal }),
    staleTime: 0,
  });

  switch (status) {
    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>History loading error</p>
          <p className={'pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </Card>
      );

    case 'pending':
      return <Skeleton className="h-[500px] w-full rounded-xl" />;

    case 'success': {
      const events = data!.filter((p) => p.events.length > 0);
      if (events.length === 0) {
        return (
          <Card className={'flex flex-col items-center gap-2 py-4'}>
            <p className={'text-xl'}>Nothing happened yet</p>
          </Card>
        );
      }
      return (
        <div className={'flex w-full flex-col pb-96'}>
          {events.map((point, index) => (
            <div key={point.id} className={'flex gap-4'}>
              <div
                className={
                  'flex w-16 shrink-0 flex-col items-center justify-start pt-2 sm:w-30'
                }
              >
                <div
                  className={
                    'flex w-full flex-col items-center justify-center rounded-md bg-gray-50 px-2 py-2 shadow shadow-pink-900'
                  }
                >
                  <div className={'font-semibold'}>Day {point.projectDay}</div>
                  <div className={'text-muted-foreground text-center text-xs'}>
                    {dayjs(point.date).format('D MMM')}
                  </div>
                </div>
              </div>
              <div className={'mx-2 flex shrink-0 flex-col items-center pt-4'}>
                <TimelineDot />
                {index < events.length - 1 && (
                  <div className={'min-h-8 flex-1'}>
                    <TimelineLine />
                  </div>
                )}
              </div>
              <div className={'flex-1 pt-2 pb-6'}>
                <EventsCard events={point.events} project={project} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    default:
      return notReachable(status);
  }
};

const EventsCard = ({
  events,
  project,
}: {
  events: TimelineEventHydrated[];
  project: ProjectPreviewEntity;
}) => {
  return (
    <div className={'rounded-md bg-gray-50 px-2 py-2 shadow shadow-pink-900'}>
      <ul className={'flex flex-col gap-1'}>
        {events.map((event) => (
          <li>
            <EventCard event={event} project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const EventCard = ({
  event,
  project,
}: {
  event: TimelineEventHydrated;
  project: ProjectPreviewEntity;
}) => {
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

    case 'focus.changed':
      return (
        <div className={''}>
          <Focus className={'mr-1 inline-block text-purple-500'} />
          {event.milestoneIds.length === 0
            ? 'All milestones unfocused'
            : `Focus changed to: ${event.milestoneTitles.join(', ')}`}
        </div>
      );

    case 'soul.updated':
      return (
        <div className={''}>
          <Sparkles className={'mr-1 inline-block text-amber-500'} />
          Project profile updated: {event.description}
        </div>
      );

    case 'chat.created':
      return (
        <div className={''}>
          <MessageSquare className={'mr-1 inline-block text-blue-500'} />
          <Link
            to={`/project/${project.id}/chat/${event.chatId}`}
            className={'underline'}
          >
            New chat started
          </Link>
          {event.contextType && event.contextLabel && (
            <span className={'text-muted-foreground'}>
              {' '}
              — {event.contextType}: {event.contextLabel}
            </span>
          )}
        </div>
      );

    case 'task.completed':
      return (
        <div className={''}>
          <IconCheck className={'mr-1 inline-block text-green-600'} />
          Task completed: <strong>{event.taskTitle}</strong>
          {event.message && (
            <span className={'text-muted-foreground'}> — {event.message}</span>
          )}
        </div>
      );

    default:
      return notReachable(event);
  }
};
