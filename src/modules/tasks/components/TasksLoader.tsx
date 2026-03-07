import { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getTasks } from '@/modules/tasks/api/getTasks';
import { TaskEntity } from '@/modules/tasks/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type Props = {
  milestoneId: string;
  children: (
    chat: TaskEntity[],
    reload: () => void,
    setData: (tasks: TaskEntity[]) => void,
  ) => ReactNode;
};

export const TasksLoader = ({ milestoneId, children }: Props): ReactNode => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.tasks.byMilestone(milestoneId);
  const { data, error, status, refetch } = useQuery<
    TaskEntity[],
    AxiosError<Error>
  >({
    queryKey,
    queryFn: ({ signal }) => getTasks(milestoneId, { signal }),
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
        <div className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Tasks loading error</p>
          <p className={'text-muted-foreground pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      );

    case 'success':
      return (
        <>
          {children(
            data!,
            () => refetch(),
            (tasks) => queryClient.setQueryData(queryKey, tasks),
          )}
        </>
      );

    default:
      return notReachable(status);
  }
};
