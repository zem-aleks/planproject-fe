import type { ReactNode } from 'react';

import { getProject } from '@/modules/projects/api/getProject';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useReloadableData } from '@/utils/useReloadableData';

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
  const { state, reload, setData } = useReloadableData(getProject, projectId);

  switch (state.type) {
    case 'loading':
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
            <Button variant="outline" size="sm" onClick={reload}>
              Try again
            </Button>
          </div>
        </PageTemplate>
      );

    case 'loaded':
    case 'reloading':
      return (
        <>{children({ project: state.data, reload, setProject: setData })}</>
      );

    default:
      return notReachable(state);
  }
};
