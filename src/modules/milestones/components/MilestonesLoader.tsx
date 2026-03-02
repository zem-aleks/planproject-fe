import { ReactNode } from 'react';

import { useReloadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getMilestones } from '@/modules/milestones/api/getMilestones';
import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';

type Props = {
  phaseId: string;
  children: (chat: MilestoneEntity[], reload: () => void) => ReactNode;
};

export const MilestonesLoader = ({ phaseId, children }: Props): ReactNode => {
  const { state, reload } = useReloadableQuery<MilestoneEntity[]>({
    queryKey: queryKeys.milestones.byPhase(phaseId),
    queryFn: ({ signal }) => getMilestones(phaseId, { signal }),
  });

  switch (state.type) {
    case 'loading':
      return <Skeleton className="h-[500px] w-full rounded-xl" />;

    case 'error':
      return (
        <div className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Milestones loading error</p>
          <p className={'text-muted-foreground pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      );

    case 'reloading':
    case 'loaded':
      return <>{children(state.data, reload)}</>;

    default:
      return notReachable(state);
  }
};
