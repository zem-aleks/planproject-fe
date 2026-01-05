import { useParams } from 'react-router';

import { getMilestone } from '@/modules/milestones/api/getMilestone';
import { CompleteMilestoneForm } from '@/modules/milestones/components/CompleteMilestoneForm';
import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';

export const MilestonePage = () => {
  const { project } = useProjectByUrlParam();
  const { milestoneId } = useParams<{ milestoneId: string }>();
  if (!project || project.status === 'draft' || !milestoneId) {
    return <ProjectNotFound />;
  }

  return <PageContent project={project} milestoneId={milestoneId} />;
};

const PageContent = ({
  project,
  milestoneId,
}: {
  project: ProjectEntity;
  milestoneId: string;
}) => {
  const { state, reload } = useLoadableData(getMilestone, milestoneId);
  switch (state.type) {
    case 'loading':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [
              { title: 'Projects', href: '/projects' },
              { title: `${project.title}`, href: `/project/${project.id}` },
            ],
            title: `Loading the milestone...`,
          }}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 pt-0">
            <div className={'text-xl text-white'}>Loading...</div>
            <Spinner className={'size-20 text-white'} />
          </div>
        </PageTemplate>
      );

    case 'loaded':
      return <LoadedContentPage project={project} milestone={state.data} />;

    case 'error':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [
              { title: 'Projects', href: '/projects' },
              { title: `${project.title}`, href: `/project/${project.id}` },
            ],
            title: `Error`,
          }}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 pt-0">
            <div className={'text-xl text-white'}>Something went wrong</div>
            <Button onClick={reload} size={'lg'}>
              Try again
            </Button>
          </div>
        </PageTemplate>
      );

    default:
      return notReachable(state);
  }
};

const LoadedContentPage = ({
  project,
  milestone,
}: {
  project: ProjectEntity;
  milestone: MilestoneDetailsEntity;
}) => {
  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: `${project.title}`, href: `/project/${project.id}` },
          {
            title: `${milestone.phase.title}`,
            href: `/project/${project.id}/phase/${milestone.phase.id}`,
          },
        ],
        title: milestone.title,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {milestone.status === 'inProgress' && (
          <DaysCounter
            startedAt={milestone.startedAt}
            daysCount={milestone.daysNeeded}
          />
        )}
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-1">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold text-white'
              }
            >
              {milestone.title}
            </h1>
          </div>

          <Badge
            variant={milestone.status === 'inProgress' ? 'warning' : 'default'}
          >
            {milestone.status}
          </Badge>
        </div>

        <div className={'flex flex-col gap-2'}>
          <div className={'text-gray-200'}>{milestone.description}</div>
          <div className={'flex items-center gap-1 text-gray-50'}>
            <b>Estimation:</b>
            <Badge>{milestone.daysNeeded} days</Badge>
          </div>
          <div className={'rounded-lg bg-green-600 p-2 px-4 text-gray-200'}>
            <b className={'text-gray-50'}>Definition of done:</b>{' '}
            <span>{milestone.definitionOfDone}</span>
          </div>

          <Card className={'w-full gap-2 p-4'}>
            <div className={'font-semibold'}>Steps:</div>
            <MarkdownFormat>{milestone.steps}</MarkdownFormat>
          </Card>
          <Card className={'w-full gap-2 p-4'}>
            <div className={'font-semibold'}>Useful resources:</div>
            <MarkdownFormat>{milestone.usefulResources}</MarkdownFormat>
          </Card>
        </div>

        {milestone.status !== 'completed' && (
          <CompleteMilestoneForm milestone={milestone} onUpdate={() => {}} />
        )}

        {/*<TasksBlock milestone={milestone} />*/}
      </div>
    </PageTemplate>
  );
};
