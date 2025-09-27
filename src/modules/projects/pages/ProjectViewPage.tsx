import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';

export const ProjectViewPage = () => {
  const project = useProjectByUrlParam();
  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Projects', href: '/projects' }],
        title: `${project.title}`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-1">
          <h1 className={'text-2xl'}>{project.title}</h1>
          <p className={'text-muted-foreground'}>
            Description: {project.description || 'No description available'}
          </p>
        </div>
      </div>
    </PageTemplate>
  );
};
