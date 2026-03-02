import { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getPhase } from '@/modules/phases/api/getPhase';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery } from '@tanstack/react-query';

type Props = {
  phaseId: string;
  children: (chat: PhaseEntity, reload: () => void) => ReactNode;
};

export const PhaseLoader = ({ phaseId, children }: Props): ReactNode => {
  const { data, error, status, refetch } = useQuery<
    PhaseEntity,
    AxiosError<Error>
  >({
    queryKey: queryKeys.phases.detail(phaseId),
    queryFn: ({ signal }) => getPhase(phaseId, { signal }),
  });

  switch (status) {
    case 'pending':
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      );

    case 'error':
      return (
        <Card className={'mx-4 flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Phase loading error</p>
          <p className={'text-muted-foreground pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </Card>
      );

    case 'success':
      return <>{children(data!, () => refetch())}</>;

    default:
      return notReachable(status);
  }
};
