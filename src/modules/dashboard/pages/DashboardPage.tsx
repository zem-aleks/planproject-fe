import { useNavigate } from 'react-router';

import { WelcomeModal } from '@/modules/dashboard/components/WelcomeModal';
import { getProject } from '@/modules/projects/api/getProject';
import { ProjectActions } from '@/modules/projects/components/ProjectActions';
import { ProjectHeading } from '@/modules/projects/components/ProjectHeading';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { InitSoulForm } from '@/modules/soul/components/InitSoulForm';
import { SoulBlock } from '@/modules/soul/components/SoulBlock';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { notReachable } from '@/utils/notReachable';
import { useReloadableData } from '@/utils/useReloadableData';

export const DashboardPage = () => {
  const { project: contextProject, reload: reloadContext } =
    useProjectByUrlParam();

  if (!contextProject || contextProject.status === 'draft') {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <WelcomeModal />
      <DashboardLoader
        contextProject={contextProject}
        reloadContext={reloadContext}
      />
    </ActiveProjectGuard>
  );
};

const DashboardLoader = ({
  contextProject,
  reloadContext,
}: {
  contextProject: ProjectPreviewEntity;
  reloadContext: () => void;
}) => {
  const { state, reload } = useReloadableData(getProject, contextProject.id);

  const reloadAll = () => {
    reload();
    reloadContext();
  };

  // Use loaded data merged with context soul, or fall back to context project
  const project: ProjectPreviewEntity = (() => {
    switch (state.type) {
      case 'loaded':
      case 'reloading':
        return {
          ...contextProject,
          ...state.data,
          soul: state.data.soul ?? contextProject.soul,
        };
      case 'loading':
      case 'error':
        return contextProject;
      default:
        return notReachable(state);
    }
  })();

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
        <DashboardContent project={project} onChanged={reloadAll} />
      </div>
    </PageTemplate>
  );
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
          <SoulBlock project={project} onProjectChanged={onChanged} />
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

          <SoulBlock project={project} onProjectChanged={onChanged} />
        </>
      );

    default:
      return notReachable(project.status);
  }
};
