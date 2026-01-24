import { useContext } from 'react';

import { ProjectHeading } from '@/modules/projects/components/ProjectHeading';
import { UnlockProjectForm } from '@/modules/projects/components/forms/UnlockProjectForm';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';

export const NotActivatedProjectPage = ({
  project,
}: {
  project: ProjectPreviewEntity;
}) => {
  const { reload } = useContext(ProjectsContext);
  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Projects', href: '/projects' }],
        title: `${project.title}`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ProjectHeading project={project} />
        <UnlockProjectForm
          project={project}
          onUnlock={() => {
            reload();
          }}
        />
      </div>
    </PageTemplate>
  );
};
