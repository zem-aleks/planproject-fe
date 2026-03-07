import { useParams } from 'react-router';

import { Target } from 'lucide-react';

import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { DiscoverButton } from '@/modules/soul/components/DiscoverButton';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';

export const DesiredOutcomesPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project }) => (
          <DesiredOutcomesContent project={project} projectId={projectId} />
        )}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const DesiredOutcomesContent = ({
  project,
  projectId,
}: {
  project: ProjectPreviewEntity;
  projectId: string;
}) => {
  const outcomes = project.soul?.desiredOutcomes ?? [];

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: 'Desired Outcomes',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">
              Desired Outcomes
            </h1>
            <div className="text-gray-200">
              Success criteria and goals for your project
            </div>
          </div>
          <DiscoverButton projectId={projectId} contextType="desired_outcome" />
        </div>

        {outcomes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {outcomes.map((o, i) => (
              <Card key={i} className="flex items-start gap-3 p-4">
                <Target className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <div className="flex flex-1 items-start justify-between gap-2">
                  <span className="text-sm leading-relaxed">{o.outcome}</span>
                  {o.inferred && (
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      Suggested
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-5">
            <p className="text-muted-foreground text-sm">
              No desired outcomes defined
            </p>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};
