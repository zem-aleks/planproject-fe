import { Link } from 'react-router';

import { Map } from 'lucide-react';

import { WelcomeModal } from '@/modules/dashboard/components/WelcomeModal';
import { PhaseItemBuilder } from '@/modules/phases/components/PhaseItemBuilder';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhasesTimeline } from '@/modules/phases/components/PhasesTimeline';
import { ProjectActions } from '@/modules/projects/components/ProjectActions';
import { ProjectLogoBuilder } from '@/modules/projects/components/ProjectLogoBuilder';
import { ProjectStatusBadge } from '@/modules/projects/components/ProjectStatus';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { FinishShapingFormInternal } from '@/modules/shaping/components/FinishShapingFormInternal';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { Separator } from '@/ui/separator';
import { notReachable } from '@/utils/notReachable';

export const DashboardPage = () => {
  const { project, reload } = useProjectByUrlParam();
  if (!project || project.status === 'draft') {
    return <ProjectNotFound />;
  }

  return (
    <>
      <WelcomeModal />
      <PageTemplate
        header={{
          breadcrumbs: [{ title: 'Projects', href: '/projects' }],
          title: `${project.title}`,
        }}
      >
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {project.status === 'active' && (
            <DaysCounter
              startedAt={project.startedAt}
              daysCount={project.daysNeeded}
            />
          )}
          <div className={'flex flex-row gap-8'}>
            <div className="flex grow flex-col gap-1">
              <h1
                className={
                  'flex items-center justify-between gap-2 text-2xl font-semibold'
                }
              >
                {project.title}
                <ProjectStatusBadge status={project.status} />
              </h1>
              <p className={'text-muted-foreground'}>
                {project.description || 'No description available'}
              </p>
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
            </div>
          </div>

          <ProjectActions
            project={project}
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onProjectStarted':
                case 'onPhasesChanged':
                  reload();
                  break;

                default:
                  return notReachable(msg);
              }
            }}
          />

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
                <div className={'flex flex-col gap-4'}>
                  <Card className={'mt-4 flex flex-col gap-2 p-4 px-4'}>
                    <div className={'mb-4 flex flex-col gap-2'}>
                      <div
                        className={'flex items-center justify-between gap-2'}
                      >
                        <h2 className={'text-lg font-semibold'}>Main phases</h2>
                        <Button variant={'outline'} size={'sm'} asChild={true}>
                          <Link to={`/project/${project.id}/roadmap`}>
                            <Map />
                            Full Roadmap
                          </Link>
                        </Button>
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
                  </Card>
                  <PhasesTimeline phases={phases} />
                </div>
              )}
            </PhasesLoader>
          )}
        </div>
      </PageTemplate>
    </>
  );
};
