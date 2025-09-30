import { ReactNode } from 'react';

import { getPhase } from '@/modules/phases/api/getPhase';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useReloadableData } from '@/utils/useReloadableData.ts';

type Props = {
  phaseId: string;
  children: (chat: PhaseEntity, reload: () => void) => ReactNode;
};

export const PhaseLoader = ({ phaseId, children }: Props): ReactNode => {
  const { state, reload } = useReloadableData(getPhase, phaseId);

  switch (state.type) {
    case 'loading':
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      );

    case 'error':
      return (
        <div className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Phase loading error</p>
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
