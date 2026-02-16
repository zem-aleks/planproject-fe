import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { getMilestone } from '@/modules/milestones/api/getMilestone';
import { CompleteMilestoneForm } from '@/modules/milestones/components/CompleteMilestoneForm';
import { MilestoneStatusBadge } from '@/modules/milestones/components/MilestoneStatus';
import { MilestoneStepsList } from '@/modules/milestones/components/MilestoneStepsList';
import {
  MilestoneDetailsEntity,
  MilestoneEntity,
} from '@/modules/milestones/types/entity';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
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
  project: ProjectPreviewEntity;
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
      return (
        <LoadedContentPage
          project={project}
          milestone={state.data}
          onChanged={reload}
        />
      );

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
  onChanged,
}: {
  project: ProjectPreviewEntity;
  milestone: MilestoneDetailsEntity;
  onChanged: () => void;
}) => {
  const [currentMilestone, setCurrentMilestone] = useState(milestone);

  useEffect(() => {
    setCurrentMilestone(milestone);
  }, [milestone]);

  const handleStepUpdated = (updated: MilestoneEntity) => {
    setCurrentMilestone((prev) => ({ ...prev, ...updated }));
  };

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: `${project.title}`, href: `/project/${project.id}` },
          {
            title: `${currentMilestone.phase.title}`,
            href: `/project/${project.id}/phase/${currentMilestone.phase.id}`,
          },
        ],
        title: currentMilestone.title,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {currentMilestone.status === 'inProgress' && (
          <DaysCounter
            startedAt={currentMilestone.startedAt}
            daysCount={currentMilestone.daysNeeded}
          />
        )}
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-1">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold text-white'
              }
            >
              {currentMilestone.title}
            </h1>
          </div>

          <MilestoneStatusBadge status={currentMilestone.status} />
        </div>

        <div className={'flex flex-col gap-2'}>
          <div className={'text-gray-200'}>{currentMilestone.description}</div>
          <div className={'flex items-center gap-1 text-gray-50'}>
            <b>Estimation:</b>
            <Badge>{currentMilestone.daysNeeded} days</Badge>
          </div>
          <div className={'rounded-lg bg-green-600 p-2 px-4 text-gray-200'}>
            <b className={'text-gray-50'}>Definition of done:</b>{' '}
            <span>{currentMilestone.definitionOfDone}</span>
          </div>

          <Card className={'w-full gap-2 p-4'}>
            <MilestoneStepsList
              milestone={currentMilestone}
              onUpdated={handleStepUpdated}
            />
          </Card>
          <Card className={'w-full gap-2 p-4'}>
            <div className={'font-semibold'}>Useful resources:</div>
            <MarkdownFormat>{currentMilestone.usefulResources}</MarkdownFormat>
          </Card>
        </div>

        {currentMilestone.status !== 'completed' && (
          <CompleteMilestoneForm
            milestone={currentMilestone}
            onUpdate={onChanged}
          />
        )}

        {currentMilestone.status === 'completed' &&
          currentMilestone.completeMessage && (
            <Card className={'w-full gap-2 bg-pink-100 p-4'}>
              <div className={'font-semibold'}>Completed with comment:</div>
              <MarkdownFormat>
                {currentMilestone.completeMessage}
              </MarkdownFormat>
            </Card>
          )}

        {/*<TasksBlock milestone={milestone} />*/}
      </div>
    </PageTemplate>
  );
};
