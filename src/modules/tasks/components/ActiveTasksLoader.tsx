import { ReactNode } from 'react';

import { getActiveTasks } from '@/modules/tasks/api/getActiveTasks';
import { TaskDetailsEntity } from '@/modules/tasks/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useReloadableData } from '@/utils/useReloadableData.ts';

type Props = {
  projectId: string;
  children: (
    chat: TaskDetailsEntity[],
    reload: () => void,
    setData: (tasks: TaskDetailsEntity[]) => void,
  ) => ReactNode;
};

export const ActiveTasksLoader = ({
  projectId,
  children,
}: Props): ReactNode => {
  const { state, reload, setData } = useReloadableData(
    getActiveTasks,
    projectId,
  );

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
          <p className={'text-xl text-red-700'}>Tasks loading error</p>
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
