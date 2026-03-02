import { ReactNode } from 'react';

import { useReloadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getTasks } from '@/modules/tasks/api/getTasks';
import { TaskEntity } from '@/modules/tasks/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';

type Props = {
  milestoneId: string;
  children: (
    chat: TaskEntity[],
    reload: () => void,
    setData: (tasks: TaskEntity[]) => void,
  ) => ReactNode;
};

export const TasksLoader = ({ milestoneId, children }: Props): ReactNode => {
  const { state, reload, setData } = useReloadableQuery<TaskEntity[]>({
    queryKey: queryKeys.tasks.byMilestone(milestoneId),
    queryFn: ({ signal }) => getTasks(milestoneId, { signal }),
  });

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
