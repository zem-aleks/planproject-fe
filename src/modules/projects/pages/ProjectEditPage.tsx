import { useParams } from 'react-router';

import { ProjectLoader } from '@/modules/projects/components/ProjectLoader.tsx';
import { ProjectEditForm } from '@/modules/projects/components/forms/ProjectEditForm.tsx';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';

export const ProjectEditPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) {
    throw new Error('Project ID is required');
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Projects', href: '/projects' }],
        title: 'Edit Project',
      }}
    >
      <ProjectLoader projectId={projectId}>
        {(project) => <ProjectEditForm project={project} />}
      </ProjectLoader>
    </PageTemplate>
  );
};
