import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { ShapingForm } from '@/modules/shaping/components/ShapingForm';
import { ShapingLoader } from '@/modules/shaping/components/ShapingLoader';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { notReachable } from '@/utils/notReachable';

export const ProjectViewPage = () => {
  const { project, reload } = useProjectByUrlParam();
  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Projects', href: '/projects' }],
        title: `${project.title}`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex flex-col gap-1">
          <h1 className={'text-2xl'}>{project.title}</h1>
          <p className={'text-muted-foreground'}>
            {project.description || 'No description available'}
          </p>
        </div>

        {project.status === 'analyzing' && <div>Shaping is completed</div>}

        {project.status === 'shaping' && (
          <ShapingLoader projectId={project.id}>
            {(shaping, setData) => (
              <ShapingForm
                project={project}
                shaping={shaping}
                onMsg={(msg) => {
                  switch (msg.type) {
                    case 'onUpdate':
                      setData(msg.shaping);
                      break;

                    case 'onFinish':
                      reload();
                      break;

                    default:
                      return notReachable(msg);
                  }
                }}
              />
            )}
          </ShapingLoader>
        )}
      </div>
    </PageTemplate>
  );
};
