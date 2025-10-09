import { Link } from 'react-router';

import { PhaseItemBuilder } from '@/modules/phases/components/PhaseItemBuilder';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhasesTimeline } from '@/modules/phases/components/PhasesTimeline';
import { ProjectLogoBuilder } from '@/modules/projects/components/ProjectLogoBuilder';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { StartProjectForm } from '@/modules/projects/components/forms/StartProjectForm';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { FinishShapingFormInternal } from '@/modules/shaping/components/FinishShapingFormInternal';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { Separator } from '@/ui/separator';
import { notReachable } from '@/utils/notReachable';

export const DashboardPage = () => {
  const { project, reload } = useProjectByUrlParam();
  if (!project || project.status === 'draft') {
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
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-1">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold'
              }
            >
              {project.title}
              <Badge>Status: {project.status}</Badge>
            </h1>
            <p className={'text-muted-foreground'}>
              {project.description || 'No description available'}
            </p>

            <StartProjectForm project={project} onStarted={reload} />

            {project.status === 'active' && (
              <Button className={'mt-2'} asChild>
                <Link to={`/project/${project.id}/workspace`}>
                  Open workspace
                </Link>
              </Button>
            )}
          </div>
          <div className={'flex flex-col gap-2'}>
            <ProjectLogoBuilder
              project={project}
              onMsg={(msg) => {
                switch (msg.type) {
                  case 'onProjectUpdated':
                    reload();
                    break;

                  default:
                    return notReachable(msg.type);
                }
              }}
            />
            {project.status === 'active' && (
              <DaysCounter
                startedAt={project.startedAt}
                daysCount={project.daysNeeded}
              />
            )}
          </div>
        </div>

        {project.status === 'shaping' ? (
          <FinishShapingFormInternal
            shapingId={project.shapingId}
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onFinish':
                  reload();
                  break;

                default:
                  return notReachable(msg.type);
              }
            }}
          />
        ) : (
          <PhasesLoader projectId={project.id}>
            {(phases) => (
              <div className={'mt-4 flex flex-col gap-4'}>
                <div className={'mb-4 flex flex-col gap-2'}>
                  <div className={'flex items-center justify-between gap-2'}>
                    <h2 className={'text-lg font-semibold'}>Main phases</h2>
                    {project.status === 'analyzing' && (
                      <Button
                        variant={'outline'}
                        size={'sm'}
                        onClick={() => alert('Coming soon!')}
                      >
                        Modify Phases
                      </Button>
                    )}
                  </div>
                  <ol className={'flex flex-col gap-2'}>
                    {phases.map((phase, index) => (
                      <li key={phase.id} className={''}>
                        <PhaseItemBuilder
                          phase={phase}
                          project={project}
                          index={index}
                        />
                        <Separator />
                      </li>
                    ))}
                  </ol>
                </div>
                <PhasesTimeline phases={phases} />
              </div>
            )}
          </PhasesLoader>
        )}
      </div>
    </PageTemplate>
  );
};
