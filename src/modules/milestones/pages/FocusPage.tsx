import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { TodayTimelineContent } from '@/modules/timeline/components/TodayTimelineContent';
import { TodayTimelineLoader } from '@/modules/timeline/components/TodayTimelineLoader';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { notReachable } from '@/utils/notReachable';

export const FocusPage = () => {
  const { project } = useProjectByUrlParam();
  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: `Focus Space`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-0">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold text-white'
              }
            >
              Focus Space
            </h1>
            <div className={'text-gray-200'}>
              Suggested items to be accomplished today. Try to focus on one
              thing at a time and step by step your project will be done.
            </div>
          </div>
          <DaysCounter
            startedAt={project.startedAt}
            daysCount={project.daysNeeded}
          />
        </div>

        <TodayTimelineLoader projectId={project.id}>
          {(milestone, reload) => (
            <TodayTimelineContent
              project={project}
              milestone={milestone}
              onMsg={(msg) => {
                switch (msg.type) {
                  case 'onNewMilestoneActivated':
                  case 'onMilestoneCompleted':
                    reload();
                    break;

                  default:
                    return notReachable(msg);
                }
              }}
            />
          )}
        </TodayTimelineLoader>
      </div>
    </PageTemplate>
  );
};
