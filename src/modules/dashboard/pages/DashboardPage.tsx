import { useNavigate } from 'react-router';

import { WelcomeModal } from '@/modules/dashboard/components/WelcomeModal';
import { PhaseItemBuilder } from '@/modules/phases/components/PhaseItemBuilder';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhasesTimeline } from '@/modules/phases/components/PhasesTimeline';
import { ProjectActions } from '@/modules/projects/components/ProjectActions';
import { ProjectHeading } from '@/modules/projects/components/ProjectHeading';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { ModifyPhasesForm } from '@/modules/projects/components/forms/ModifyPhasesForm';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { Separator } from '@/ui/separator';
import { notReachable } from '@/utils/notReachable';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { project, reload } = useProjectByUrlParam();
  if (!project || project.status === 'draft') {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
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
          <ProjectHeading project={project} />

          <ProjectActions
            project={project}
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onProjectStarted':
                  reload();
                  navigate(`/project/${project.id}/focus`);
                  break;

                case 'onPhasesChanged':
                  reload();
                  break;

                default:
                  return notReachable(msg);
              }
            }}
          />

          <PhasesLoader projectId={project.id}>
            {(phases, reload) => (
              <div className={'flex flex-col gap-4'}>
                <Card className={'mt-4 flex flex-col gap-2 p-4 px-4'}>
                  <div className={'mb-4 flex flex-col gap-2'}>
                    <div className={'flex items-center justify-between gap-2'}>
                      <h2 className={'text-lg font-semibold'}>Main phases</h2>
                      <div className={'flex gap-2'}>
                        <ModifyPhasesForm
                          project={project}
                          onModified={reload}
                        />

                        {/*<Button variant={'outline'} size={'sm'} asChild={true}>*/}
                        {/*  <Link to={`/project/${project.id}/roadmap`}>*/}
                        {/*    <Map />*/}
                        {/*    Full Roadmap*/}
                        {/*  </Link>*/}
                        {/*</Button>*/}
                      </div>
                    </div>
                    <ol className={'flex flex-col gap-2'}>
                      {phases.map((phase, index) => (
                        <li key={phase.id} className={''}>
                          <PhaseItemBuilder
                            phase={phase}
                            project={project}
                            index={index}
                            onChange={() => reload()}
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
        </div>
      </PageTemplate>
    </ActiveProjectGuard>
  );
};
