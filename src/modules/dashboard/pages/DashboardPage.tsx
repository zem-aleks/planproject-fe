import { useNavigate, useParams } from 'react-router';

import { WelcomeModal } from '@/modules/dashboard/components/WelcomeModal';
import { getProject } from '@/modules/projects/api/getProject';
import { ProjectActions } from '@/modules/projects/components/ProjectActions';
import { ProjectHeading } from '@/modules/projects/components/ProjectHeading';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { InitSoulForm } from '@/modules/soul/components/InitSoulForm';
import { SoulBlock } from '@/modules/soul/components/SoulBlock';
import { SoulQueueSnackbar } from '@/modules/soul/components/SoulQueueSnackbar';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useReloadableData } from '@/utils/useReloadableData';

export const DashboardPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <WelcomeModal />
      <DashboardLoader projectId={projectId} />
    </ActiveProjectGuard>
  );
};

const DashboardLoader = ({ projectId }: { projectId: string }) => {
  const { state, reload } = useReloadableData(getProject, projectId);

  switch (state.type) {
    case 'loading':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [{ title: 'Projects', href: '/projects' }],
            title: 'Loading…',
          }}
        >
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Card className="flex items-center gap-3 p-5">
              <Spinner className="size-5" />
              <span className="text-muted-foreground text-sm">
                Loading project…
              </span>
            </Card>
          </div>
        </PageTemplate>
      );

    case 'error':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [{ title: 'Projects', href: '/projects' }],
            title: 'Error',
          }}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
            <p className="text-muted-foreground text-sm">
              Failed to load project
            </p>
            <Button variant="outline" size="sm" onClick={reload}>
              Try again
            </Button>
          </div>
        </PageTemplate>
      );

    case 'loaded':
    case 'reloading':
      if (state.data.status === 'draft') {
        return <ProjectNotFound />;
      }
      return (
        <>
          <PageTemplate
            header={{
              breadcrumbs: [{ title: 'Projects', href: '/projects' }],
              title: state.data.title,
            }}
          >
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {state.data.status === 'active' && (
                <DaysCounter
                  startedAt={state.data.startedAt}
                  daysCount={state.data.daysNeeded}
                />
              )}
              <ProjectHeading project={state.data} />
              <DashboardContent project={state.data} onChanged={reload} />
            </div>
          </PageTemplate>
          <SoulQueueSnackbar project={state.data} onProjectChanged={reload} />
        </>
      );

    default:
      return notReachable(state);
  }
};

const DashboardContent = ({
  project,
  onChanged,
}: {
  project: ProjectPreviewEntity;
  onChanged: () => void;
}) => {
  const navigate = useNavigate();

  switch (project.status) {
    case 'soulBuilding':
      // TODO: quick version of poller
      setTimeout(onChanged, 10000);
      return (
        <Card className={'flex flex-row items-center gap-2 p-4'}>
          <div className={''}>
            <img
              src={'/images/cat_loading.gif'}
              width={150}
              height={150}
              alt={'Building'}
              className={'-mt-5 -mb-2 -ml-5 h-37.5 w-37.5'}
            />
          </div>
          <div className={'w-full'}>
            <div className={'text-xl font-bold'}>Please wait</div>
            <div className={'text-lg'}>
              At this moment we're doing initialization of your project SOUL
            </div>
          </div>
        </Card>
      );

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

    default:
      return notReachable(project.status);
  }
};
