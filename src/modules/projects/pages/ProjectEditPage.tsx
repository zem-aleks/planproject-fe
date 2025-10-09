import { useParams } from 'react-router';

import { ProjectLoader } from '@/modules/projects/components/ProjectLoader.tsx';
import { ProjectEditForm } from '@/modules/projects/components/forms/ProjectEditForm.tsx';
import { ProjectShapingForm } from '@/modules/projects/components/forms/ProjectShapingForm';
import { ShapingLoader } from '@/modules/shaping/components/ShapingLoader';
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
        {(project) =>
          project.status === 'draft' ? (
            <ShapingLoader projectId={project.id}>
              {(shaping, setData) => (
                <ProjectShapingForm
                  project={project}
                  shaping={shaping}
                  onUpdate={setData}
                />
              )}
            </ShapingLoader>
          ) : (
            <ProjectEditForm project={project} />
          )
        }
      </ProjectLoader>
    </PageTemplate>
  );
};
