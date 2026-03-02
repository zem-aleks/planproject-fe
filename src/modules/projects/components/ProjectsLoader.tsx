import { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getProjects } from '@/modules/projects/api/getProjects';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { PageLoader } from '@/modules/templates/components/PageLoader';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Button } from '@/ui/button.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useQuery } from '@tanstack/react-query';

type Props = {
  children: (projects: ProjectPreviewEntity[], reload: () => void) => ReactNode;
};

export const ProjectsLoader = ({ children }: Props): ReactNode => {
  const { data, error, status, refetch } = useQuery<
    ProjectPreviewEntity[],
    AxiosError<Error>
  >({
    queryKey: queryKeys.projects.list(),
    queryFn: ({ signal }) => getProjects(undefined, { signal }),
  });

  switch (status) {
    case 'pending':
      return <PageLoader />;

    case 'error':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [],
            title: 'Loading Error',
          }}
        >
          <div className={'flex flex-col items-center gap-2 py-4'}>
            <p className={'text-xl text-red-700'}>Projects loading error</p>
            <p className={'text-muted-foreground pb-2'}>{error.message}</p>
            <Button onClick={() => refetch()}>Try again</Button>
          </div>
        </PageTemplate>
      );

    case 'success':
      return <>{children(data!, () => refetch())}</>;

    default:
      return notReachable(status);
  }
};
