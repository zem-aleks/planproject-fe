import { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getProject } from '@/modules/projects/api/getProject.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery } from '@tanstack/react-query';

type Props = {
  projectId: string;
  children: (chat: ProjectEntity) => ReactNode;
};

export const ProjectLoader = ({ children, projectId }: Props): ReactNode => {
  const { data, error, status, refetch } = useQuery<
    ProjectEntity,
    AxiosError<Error>
  >({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: ({ signal }) => getProject(projectId, { signal }),
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
        <div className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Project loading error</p>
          <p className={'text-muted-foreground pb-2'}>{error.message}</p>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      );

    case 'success':
      return <>{children(data!)}</>;

    default:
      return notReachable(status);
  }
};
