import { ActivePhases } from '@/modules/phases/components/ActivePhases';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';

export const WorkspacePage = () => {
  const { project } = useProjectByUrlParam();
  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: `Workspace`,
      }}
    >
      <PhasesLoader projectId={project.id}>
        {(phases) => (
          <div className="flex flex-col gap-4 px-4 py-0">
            <ActivePhases phases={phases} />
          </div>
        )}
      </PhasesLoader>
    </PageTemplate>
  );
};
