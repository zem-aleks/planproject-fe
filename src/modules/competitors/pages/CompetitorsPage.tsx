import { CompetitorsLoader } from '@/modules/competitors/components/CompetitorsLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';

export const CompetitorsPage = () => {
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
        title: `Competitors`,
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
              Competitors
            </h1>
            <div className={'text-gray-200'}>
              List of potential competitors ordered by competition rating
            </div>
          </div>
        </div>

        {/*<TodayTimelineLoader projectId={project.id}>*/}
        {/*  {(timelinePoint, reload) => <>Today timeline point</>}*/}
        {/*</TodayTimelineLoader>*/}

        <CompetitorsLoader project={project} />
      </div>
    </PageTemplate>
  );
};
