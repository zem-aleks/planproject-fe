import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { queryKeys } from '@/lib/queryKeys';
import { WelcomeModal } from '@/modules/dashboard/components/WelcomeModal';
import { PhaseItemBuilder } from '@/modules/phases/components/PhaseItemBuilder';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhasesTimeline } from '@/modules/phases/components/PhasesTimeline';
import { ProjectActions } from '@/modules/projects/components/ProjectActions';
import { ProjectHeading } from '@/modules/projects/components/ProjectHeading';
import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { ModifyPhasesForm } from '@/modules/projects/components/forms/ModifyPhasesForm';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { InitSoulForm } from '@/modules/soul/components/InitSoulForm';
import { SoulBlock } from '@/modules/soul/components/SoulBlock';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { Separator } from '@/ui/separator';
import { notReachable } from '@/utils/notReachable';
import { useQueryClient } from '@tanstack/react-query';

export const DashboardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <WelcomeModal />
      <ProjectPageLoader projectId={projectId}>
        {({ project, reload }) => {
          if (project.status === 'draft') {
            return <ProjectNotFound />;
          }
          return (
            <PageTemplate
              header={{
                breadcrumbs: [{ title: 'Projects', href: '/projects' }],
                title: project.title,
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
                <DashboardContent project={project} onChanged={reload} />
              </div>
            </PageTemplate>
          );
        }}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const DashboardContent = ({
  project,
  onChanged,
}: {
  project: ProjectEntity;
  onChanged: () => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  switch (project.status) {
    case 'soulBuilding':
      return <SoulBuildingCard onChanged={onChanged} />;

    case 'shaping':
    case 'soulError':
      return <InitSoulForm project={project} onInitiated={onChanged} />;

    case 'soulDone':
      return (
        <>
          <ProjectActions
            project={project}
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onProjectStarted':
                  onChanged();
                  navigate(`/project/${project.id}/focus`);
                  break;

                case 'onPlanBuilt':
                  onChanged();
                  queryClient.invalidateQueries({
                    queryKey: queryKeys.phases.byProject(project.id),
                  });
                  break;

                case 'onPhasesChanged':
                  onChanged();
                  break;

                case 'onSoulChanged':
                  onChanged();
                  break;

                default:
                  return notReachable(msg);
              }
            }}
          />
          <SoulBlock project={project} />
        </>
      );

    case 'draft':
    case 'analyzing':
    case 'active':
    case 'completed':
    case 'onHold':
    case 'cancelled':
      if (!project.soul) {
        return <InitSoulForm project={project} onInitiated={onChanged} />;
      }
      return (
        <>
          <ProjectActions
            project={project}
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onProjectStarted':
                  onChanged();
                  navigate(`/project/${project.id}/focus`);
                  break;

                case 'onPlanBuilt':
                  onChanged();
                  queryClient.invalidateQueries({
                    queryKey: queryKeys.phases.byProject(project.id),
                  });
                  break;

                case 'onPhasesChanged':
                  onChanged();
                  break;

                case 'onSoulChanged':
                  onChanged();
                  break;

                default:
                  return notReachable(msg);
              }
            }}
          />

          <SoulBlock project={project} />
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
                    <ol className={'flex flex-col gap-2 overflow-hidden'}>
                      {phases.map((phase, index) => (
                        <li key={phase.id} className={''}>
                          <PhaseItemBuilder
                            phase={phase}
                            project={project}
                            index={index}
                            onChange={() => reload()}
                          />
                          <Separator className={'mt-2'} />
                        </li>
                      ))}
                    </ol>
                  </div>
                </Card>
                <PhasesTimeline phases={phases} />
              </div>
            )}
          </PhasesLoader>
        </>
      );

    default:
      return notReachable(project.status);
  }
};

const SoulBuildingCard = ({ onChanged }: { onChanged: () => void }) => {
  useEffect(() => {
    const id = setInterval(onChanged, 10000);
    return () => clearInterval(id);
  }, [onChanged]);

  return (
    <Card className="flex flex-row items-center gap-2 p-4">
      <div>
        <img
          src="/images/cat_loading.gif"
          width={150}
          height={150}
          alt="Building"
          className="-mt-5 -mb-2 -ml-5 h-37.5 w-37.5"
        />
      </div>
      <div className="w-full">
        <div className="text-xl font-bold">Please wait</div>
        <div className="text-lg">
          At this moment we&apos;re doing initialization of your Project Profile
        </div>
      </div>
    </Card>
  );
};
