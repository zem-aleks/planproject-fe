import { ReactNode } from 'react';

import { useLoadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import { getProject } from '@/modules/projects/api/getProject.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import { Skeleton } from '@/ui/skeleton.tsx';
import { notReachable } from '@/utils/notReachable.ts';

type Props = {
  projectId: string;
  children: (chat: ProjectEntity) => ReactNode;
};

export const ProjectLoader = ({ children, projectId }: Props): ReactNode => {
  const { state, reload } = useLoadableQuery<ProjectEntity>({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: ({ signal }) => getProject(projectId, { signal }),
  });

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
          <p className={'text-xl text-red-700'}>Project loading error</p>
          <p className={'text-muted-foreground pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </div>
      );

    case 'loaded':
      return <>{children(state.data)}</>;

    default:
      return notReachable(state);
  }
};
