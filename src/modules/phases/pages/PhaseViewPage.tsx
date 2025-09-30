import { useParams } from 'react-router';

import { MilestonesBlock } from '@/modules/milestones/components/MilestonesBlock';
import { PhaseLoader } from '@/modules/phases/components/PhaseLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';

export const PhaseViewPage = () => {
  const { project } = useProjectByUrlParam();
  const { phaseId } = useParams<{ phaseId: string }>();
  if (!project || !phaseId) {
    return <ProjectNotFound />;
  }

  return (
    <PhaseLoader phaseId={phaseId}>
      {(phase) => (
        <PageTemplate
          header={{
            breadcrumbs: [
              { title: 'Projects', href: '/projects' },
              { title: `${project.title}`, href: `/project/${project.id}` },
            ],
            title: `Phase ${phase.title}`,
          }}
        >
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex flex-col gap-1">
              <h1 className={'text-2xl font-semibold'}>
                {project.title} - {phase.title}
              </h1>
              <p className={''}>
                {phase.description || 'No description available'}
              </p>
              <p className={'text-muted-foreground'}>
                Expertise needed: {phase.expertiseNeeded}
              </p>
            </div>

            <MilestonesBlock phase={phase} project={project} />
          </div>
        </PageTemplate>
      )}
    </PhaseLoader>
  );
};
