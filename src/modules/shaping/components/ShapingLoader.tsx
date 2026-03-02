import { ReactNode } from 'react';

import { useReloadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getShaping } from '@/modules/shaping/api/getShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button.tsx';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable.ts';

type Props = {
  projectId: string;
  children: (
    chat: ShapingEntity,
    setData: (shaping: ShapingEntity) => void,
    reload: () => void,
  ) => ReactNode;
};

export const ShapingLoader = ({ children, projectId }: Props): ReactNode => {
  const { state, reload, setData } = useReloadableQuery<ShapingEntity>({
    queryKey: queryKeys.shaping.detail(projectId),
    queryFn: ({ signal }) => getShaping(projectId, { signal }),
  });

  switch (state.type) {
    case 'loading':
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Spinner />
        </div>
      );

    case 'error':
      return (
        <div className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Shaping loading error</p>
          <p className={'text-muted-foreground pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      );

    case 'reloading':
    case 'loaded':
      return <>{children(state.data, setData, reload)}</>;

    default:
      return notReachable(state);
  }
};
