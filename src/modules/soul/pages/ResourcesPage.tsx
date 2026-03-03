import { useParams } from 'react-router';

import { Wrench } from 'lucide-react';

import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { DiscoverButton } from '@/modules/soul/components/DiscoverButton';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';

export const ResourcesPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project }) => (
          <ResourcesContent project={project} projectId={projectId} />
        )}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const ResourcesContent = ({
  project,
  projectId,
}: {
  project: ProjectPreviewEntity;
  projectId: string;
}) => {
  const resources = project.soul?.resources ?? [];

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: 'Resources & Tools',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">
              Resources & Tools
            </h1>
            <div className="text-gray-200">
              Technologies, tools, and assets used in your project
            </div>
          </div>
          <DiscoverButton projectId={projectId} contextType="resource" />
        </div>

        {resources.length > 0 ? (
          <div className="flex flex-col gap-3">
            {resources.map((r, i) => (
              <Card key={i} className="flex items-start gap-3 p-4">
                <Wrench className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{r.name}</span>
                    {r.tentative && (
                      <Badge variant="outline" className="text-[10px]">
                        Tentative
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {r.relevance}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-5">
            <p className="text-muted-foreground text-sm">
              No resources defined
            </p>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};
