import type { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import type { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';
import { getTodayTimeline } from '@/modules/timeline/api/getTodayTimeline';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery } from '@tanstack/react-query';

type Props = {
  projectId: string;
  children: (
    milestones: MilestoneDetailsEntity[],
    reload: () => void,
  ) => ReactNode;
};

export const TodayTimelineLoader = ({
  projectId,
  children,
}: Props): ReactNode => {
  const { data, error, status, refetch } = useQuery<
    MilestoneDetailsEntity[],
    AxiosError<Error>
  >({
    queryKey: queryKeys.timeline.today(projectId),
    queryFn: ({ signal }) => getTodayTimeline(projectId, { signal }),
  });

  switch (status) {
    case 'pending':
      return (
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      );

    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Timeline loading error</p>
          <p className={'pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </Card>
      );

    case 'success':
      return <>{children(data!, () => refetch())}</>;

    default:
      return notReachable(status);
  }
};
