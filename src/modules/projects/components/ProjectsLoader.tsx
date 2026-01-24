import { ReactNode } from 'react';

import { getProjects } from '@/modules/projects/api/getProjects';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { PageLoader } from '@/modules/templates/components/PageLoader';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Button } from '@/ui/button.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useLoadableData } from '@/utils/useLoadableData';

type Props = {
  children: (projects: ProjectPreviewEntity[], reload: () => void) => ReactNode;
};

export const ProjectsLoader = ({ children }: Props): ReactNode => {
  const { state, reload } = useLoadableData(getProjects, undefined);

  switch (state.type) {
    case 'loading':
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
            <p className={'text-muted-foreground pb-2'}>
              {state.error.message}
            </p>
            <Button onClick={reload}>Try again</Button>
          </div>
        </PageTemplate>
      );

    // case 'reloading':
    case 'loaded':
      return <>{children(state.data, reload)}</>;

    default:
      return notReachable(state);
  }
};
