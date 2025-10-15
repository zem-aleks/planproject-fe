import { ReactNode } from 'react';

import { getPhases } from '@/modules/phases/api/getPhases';
import { PhaseEntityWithMilestones } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useReloadableData } from '@/utils/useReloadableData.ts';

type Props = {
  projectId: string;
  children: (
    chat: PhaseEntityWithMilestones[],
    reload: () => void,
    setData: (data: PhaseEntityWithMilestones[]) => void,
  ) => ReactNode;
};

export const PhasesLoader = ({ projectId, children }: Props): ReactNode => {
  const { state, reload, setData } = useReloadableData(getPhases, projectId);

  switch (state.type) {
    case 'loading':
      return (
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      );

    case 'error':
      return (
        <div className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Phases loading error</p>
          <p className={'text-muted-foreground pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      );

    case 'reloading':
    case 'loaded':
      return <>{children(state.data, reload, setData)}</>;

    default:
      return notReachable(state);
  }
};
