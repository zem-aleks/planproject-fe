import { useParams } from 'react-router';

import { Compass, Info } from 'lucide-react';

import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { DiscoverButton } from '@/modules/soul/components/DiscoverButton';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';

export const ProjectContextPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project }) => (
          <ProjectContextContent project={project} projectId={projectId} />
        )}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const ProjectContextContent = ({
  project,
  projectId,
}: {
  project: ProjectPreviewEntity;
  projectId: string;
}) => {
  const soul = project.soul;
  const currentState = soul?.currentState;
  const domainContext = soul?.domainContext ?? [];

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: 'Project Context',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">
              Project Context
            </h1>
            <div className="text-gray-200">
              Current state and domain knowledge for your project
            </div>
          </div>
          <DiscoverButton projectId={projectId} contextType="project_context" />
        </div>

        {currentState && (
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2">
              <Info className="text-muted-foreground size-4 shrink-0" />
              <h3 className="text-sm font-semibold">Current State</h3>
            </div>
            <p className="pl-6 text-sm leading-relaxed">
              {currentState.description}
            </p>
            {currentState.keyMetrics && currentState.keyMetrics.length > 0 && (
              <>
                <Separator />
                <div className="flex flex-col gap-1.5 pl-6">
                  <span className="text-muted-foreground text-xs font-medium">
                    Key Metrics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentState.keyMetrics.map((metric) => (
                      <Badge key={metric} variant="secondary">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>
        )}

        {domainContext.length > 0 && (
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-2">
              <Compass className="text-muted-foreground size-4 shrink-0" />
              <h3 className="text-sm font-semibold">Domain Context</h3>
            </div>
            <div className="flex flex-col gap-2 pl-6">
              {domainContext.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm leading-relaxed"
                >
                  <span className="text-muted-foreground mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {!currentState && domainContext.length === 0 && (
          <Card className="p-5">
            <p className="text-muted-foreground text-sm">
              No project context available
            </p>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};
