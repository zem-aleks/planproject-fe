import { useParams } from 'react-router';

import { MilestonesBlock } from '@/modules/milestones/components/MilestonesBlock';
import { PhaseLoader } from '@/modules/phases/components/PhaseLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Badge } from '@/ui/badge';

export const PhaseViewPage = () => {
  const { project } = useProjectByUrlParam();
  const { phaseId } = useParams<{ phaseId: string }>();
  if (!project || !phaseId) {
    return <ProjectNotFound />;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: `${project.title}`, href: `/project/${project.id}` },
        ],
        title: `Phase Details`,
      }}
    >
      <PhaseLoader phaseId={phaseId}>
        {(phase) => (
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex flex-col gap-1">
              <h1 className={'text-2xl font-semibold'}>{phase.title}</h1>
              <p className={''}>
                {phase.description || 'No description available'}
              </p>
              <div className={'text-muted-foreground flex items-center gap-2'}>
                Expertise needed:{' '}
                <div className={'flex gap-1'}>
                  {phase.expertiseNeeded.split(',').map((expertise) => (
                    <Badge className={'bg-green-600 text-white'}>
                      {expertise.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className={'text-muted-foreground flex items-center gap-2'}>
                Estimation: <Badge>Min {phase.minDaysNeeded} days</Badge>
                <Badge>Max {phase.maxDaysNeeded} days</Badge>
              </div>
            </div>

            <MilestonesBlock phase={phase} project={project} />
          </div>
        )}
      </PhaseLoader>
    </PageTemplate>
  );
};
