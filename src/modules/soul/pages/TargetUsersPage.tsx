import { useParams } from 'react-router';

import { Users } from 'lucide-react';

import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { DiscoverButton } from '@/modules/soul/components/DiscoverButton';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';

export const TargetUsersPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project }) => (
          <TargetUsersContent project={project} projectId={projectId} />
        )}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const TargetUsersContent = ({
  project,
  projectId,
}: {
  project: ProjectPreviewEntity;
  projectId: string;
}) => {
  const targetUsers = project.soul?.targetUsers;

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: 'Target Users',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">Target Users</h1>
            <div className="text-gray-200">
              Who benefits from this project and audience segments
            </div>
          </div>
          <DiscoverButton projectId={projectId} contextType="target_user" />
        </div>

        {targetUsers ? (
          <div className="flex flex-col gap-3">
            <Card className="flex flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <Users className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <p className="text-sm leading-relaxed">
                  {targetUsers.description}
                </p>
              </div>
              {targetUsers.segments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-7">
                  {targetUsers.segments.map((segment) => (
                    <Badge key={segment} variant="secondary">
                      {segment}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : (
          <Card className="p-5">
            <p className="text-muted-foreground text-sm">
              No target users defined
            </p>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};
