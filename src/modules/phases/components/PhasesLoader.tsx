import { ReactNode, useEffect, useState } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getPhases } from '@/modules/phases/api/getPhases';
import { PhaseEntityWithMilestones } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type Props = {
  projectId: string;
  children: (
    chat: PhaseEntityWithMilestones[],
    reload: () => void,
    setData: (data: PhaseEntityWithMilestones[]) => void,
  ) => ReactNode;
};

export const PhasesLoader = ({ projectId, children }: Props): ReactNode => {
  const [polling, setPolling] = useState(true);
  const queryClient = useQueryClient();
  const queryKey = queryKeys.phases.byProject(projectId);
  const { data, error, status, refetch } = useQuery<
    PhaseEntityWithMilestones[],
    AxiosError<Error>
  >({
    queryKey,
    queryFn: ({ signal }) => getPhases(projectId, { signal }),
    refetchInterval: polling ? 5000 : false,
  });

  useEffect(() => {
    if (status === 'success') {
      const hasBuilding =
        data!.length === 0 || data!.some((p) => p.status === 'building');
      setPolling(hasBuilding);
    }
  }, [status, data]); // eslint-disable-line react-hooks/exhaustive-deps

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
          <p className={'text-xl text-red-700'}>Phases loading error</p>
          <p className={'text-muted-foreground pb-2'}>
            {error.response?.data.message || error.message}
          </p>
          <Button onClick={() => refetch()}>Try again</Button>
        </Card>
      );

    case 'success':
      if (!data || data.length === 0) {
        return (
          <div className="flex flex-1 flex-col gap-4">
            <Skeleton className="aspect-video rounded-xl" />
          </div>
        );
      }

      return (
        <>
          {children(
            data!,
            () => refetch(),
            (phases) => queryClient.setQueryData(queryKey, phases),
          )}
        </>
      );

    default:
      return notReachable(status);
  }
};
