import { ReactNode } from 'react';

import { getTodayTimeline } from '@/modules/timeline/api/getTodayTimeline';
import { TimelinePointEntity } from '@/modules/timeline/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useReloadableData } from '@/utils/useReloadableData.ts';

type Props = {
  projectId: string;
  children: (
    timelinePoint: TimelinePointEntity | null,
    reload: () => void,
  ) => ReactNode;
};

export const TodayTimelineLoader = ({
  projectId,
  children,
}: Props): ReactNode => {
  const { state, reload } = useReloadableData(getTodayTimeline, projectId);

  switch (state.type) {
    case 'loading':
      return (
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      );

    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Timeline loading error</p>
          <p className={'pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </Card>
      );

    case 'reloading':
    case 'loaded':
      return <>{children(state.data, reload)}</>;

    default:
      return notReachable(state);
  }
};
