import { ProjectCreateForm } from '@/modules/projects/components/forms/ProjectCreateForm.tsx';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';

export const ProjectCreatePage = () => {
  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Projects', href: '/projects' }],
        title: 'New Project',
      }}
    >
      <ProjectCreateForm />
    </PageTemplate>
  );
};
