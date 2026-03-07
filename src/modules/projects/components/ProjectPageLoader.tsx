import type { ReactNode } from 'react';

import type { AxiosError } from 'axios';

import { queryKeys } from '@/lib/queryKeys';
import { getProject } from '@/modules/projects/api/getProject';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export type ProjectPageLoaderProps = {
  project: ProjectEntity;
  reload: () => void;
  setProject: (project: ProjectEntity) => void;
};

export const ProjectPageLoader = ({
  projectId,
  children,
}: {
  projectId: string;
  children: (props: ProjectPageLoaderProps) => ReactNode;
}) => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.projects.detail(projectId);
  const { data, status, refetch } = useQuery<ProjectEntity, AxiosError<Error>>({
    queryKey,
    queryFn: ({ signal }) => getProject(projectId, { signal }),
  });

  switch (status) {
    case 'pending':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [{ title: 'Projects', href: '/projects' }],
            title: 'Loading…',
          }}
        >
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Card className="flex items-center gap-3 p-5">
              <Spinner className="size-5" />
              <span className="text-muted-foreground text-sm">Loading…</span>
            </Card>
          </div>
        </PageTemplate>
      );

    case 'error':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [{ title: 'Projects', href: '/projects' }],
            title: 'Error',
          }}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
            <p className="text-muted-foreground text-sm">
              Failed to load project
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        </PageTemplate>
      );

    case 'success':
      return (
        <>
          {children({
            project: data!,
            reload: () => refetch(),
            setProject: (project) =>
              queryClient.setQueryData(queryKey, project),
          })}
        </>
      );

    default:
      return notReachable(status);
  }
};
