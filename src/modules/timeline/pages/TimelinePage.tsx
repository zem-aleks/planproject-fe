import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { HistoryTimelineLoader } from '@/modules/timeline/components/HistoryTimelineLoader';

export const TimelinePage = () => {
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
        title: `Timeline`,
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
              Timeline
            </h1>
            <div className={'text-gray-200'}>
              Here you can check the timeline and history of your project
            </div>
          </div>
          {/*<DaysCounter*/}
          {/*  startedAt={project.startedAt}*/}
          {/*  daysCount={project.daysNeeded}*/}
          {/*/>*/}
        </div>

        {/*<TodayTimelineLoader projectId={project.id}>*/}
        {/*  {(timelinePoint, reload) => <>Today timeline point</>}*/}
        {/*</TodayTimelineLoader>*/}

        <HistoryTimelineLoader project={project} />
      </div>
    </PageTemplate>
  );
};
