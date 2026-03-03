import { useParams } from 'react-router';

import { ShieldBan } from 'lucide-react';

import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { DiscoverButton } from '@/modules/soul/components/DiscoverButton';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';

export const ConstraintsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project }) => (
          <ConstraintsContent project={project} projectId={projectId} />
        )}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const ConstraintsContent = ({
  project,
  projectId,
}: {
  project: ProjectPreviewEntity;
  projectId: string;
}) => {
  const constraints = project.soul?.constraints ?? [];

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: 'Constraints',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">Constraints</h1>
            <div className="text-gray-200">
              Limitations and boundaries for your project
            </div>
          </div>
          <DiscoverButton projectId={projectId} contextType="constraint" />
        </div>

        {constraints.length > 0 ? (
          <div className="flex flex-col gap-3">
            {constraints.map((c, i) => (
              <Card key={i} className="flex items-start gap-3 p-4">
                <ShieldBan className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.description}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {c.type}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-5">
            <p className="text-muted-foreground text-sm">
              No constraints defined
            </p>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};
