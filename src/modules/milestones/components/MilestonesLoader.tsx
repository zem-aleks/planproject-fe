import { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getMilestones } from '@/modules/milestones/api/getMilestones';
import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery } from '@tanstack/react-query';

type Props = {
  phaseId: string;
  children: (chat: MilestoneEntity[], reload: () => void) => ReactNode;
};

export const MilestonesLoader = ({ phaseId, children }: Props): ReactNode => {
  const { data, error, status, refetch } = useQuery<
    MilestoneEntity[],
    AxiosError<Error>
  >({
    queryKey: queryKeys.milestones.byPhase(phaseId),
    queryFn: ({ signal }) => getMilestones(phaseId, { signal }),
  });

  switch (status) {
    case 'pending':
      return <Skeleton className="h-[500px] w-full rounded-xl" />;

    case 'error':
      return (
        <div className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Milestones loading error</p>
          <p className={'text-muted-foreground pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      );

    case 'success':
      return <>{children(data!, () => refetch())}</>;

    default:
      return notReachable(status);
  }
};
