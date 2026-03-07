import { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getShaping } from '@/modules/shaping/api/getShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button.tsx';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type Props = {
  projectId: string;
  children: (
    chat: ShapingEntity,
    setData: (shaping: ShapingEntity) => void,
    reload: () => void,
  ) => ReactNode;
};

export const ShapingLoader = ({ children, projectId }: Props): ReactNode => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.shaping.detail(projectId);
  const { data, error, status, refetch } = useQuery<
    ShapingEntity,
    AxiosError<Error>
  >({
    queryKey,
    queryFn: ({ signal }) => getShaping(projectId, { signal }),
  });

  switch (status) {
    case 'pending':
      return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Spinner />
        </div>
      );

    case 'error':
      return (
        <div className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Shaping loading error</p>
          <p className={'text-muted-foreground pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      );

    case 'success':
      return (
        <>
          {children(
            data!,
            (shaping) => queryClient.setQueryData(queryKey, shaping),
            () => refetch(),
          )}
        </>
      );

    default:
      return notReachable(status);
  }
};
