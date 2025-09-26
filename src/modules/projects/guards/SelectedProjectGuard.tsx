import { ReactNode, useContext } from 'react';
import { Link } from 'react-router';

import { SelectedProjectContext } from '@/modules/projects/contexts/SelectedProjectContext.tsx';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Button } from '@/ui/button.tsx';

export const SelectedProjectGuard = ({
  children,
}: {
  children: (project: ProjectEntity) => ReactNode;
}) => {
  const { project } = useContext(SelectedProjectContext);

  if (!project) {
    return (
      <PageTemplate
        header={{
          breadcrumbs: [{ title: 'Projects', href: '/projects' }],
          title: 'Project is not selected',
        }}
      >
        <div
          className={
            'flex flex-col items-center justify-center gap-1 px-8 py-2'
          }
        >
          <h1 className="text-2xl font-bold">No Project Selected</h1>
          <p className="text-lg">Please select an project to continue.</p>
          <Button asChild size="sm" className="mt-2">
            <Link to="/projects">Select Project</Link>
          </Button>
        </div>
      </PageTemplate>
    );
  }

  return <>{children(project)}</>;
};
