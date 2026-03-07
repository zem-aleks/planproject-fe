import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Check, Lightbulb, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { createChat } from '@/modules/chat/api/createChat';
import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type {
  ProjectPreviewEntity,
  ProjectSoul,
} from '@/modules/projects/types/entity';
import { DiscoverButton } from '@/modules/soul/components/DiscoverButton';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';

export const DecisionsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project }) => (
          <DecisionsContent project={project} projectId={projectId} />
        )}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const DecisionsContent = ({
  project,
  projectId,
}: {
  project: ProjectPreviewEntity;
  projectId: string;
}) => {
  const soul = project.soul;
  const decisions = soul?.decisions ?? [];

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: 'Decisions',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">Decisions</h1>
            <div className="text-gray-200">
              Review decisions made about your project
            </div>
          </div>
          <DiscoverButton projectId={projectId} contextType="decision" />
        </div>

        {decisions.length > 0 ? (
          <DecisionsList decisions={decisions} projectId={projectId} />
        ) : (
          <Card className="p-5">
            <p className="text-muted-foreground text-sm">
              No decisions made yet
            </p>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};

const DecisionsList = ({
  decisions,
  projectId,
}: {
  decisions: ProjectSoul['decisions'];
  projectId: string;
}) => {
  const navigate = useNavigate();
  const [chattingIndex, setChattingIndex] = useState<number | null>(null);

  const handleStartChat = async (index: number, topic: string) => {
    setChattingIndex(index);
    try {
      const chat = await createChat(projectId, {
        type: 'decision',
        entityId: topic,
        label: topic,
      });
      navigate(`/project/${projectId}/chat/${chat.id}`);
    } catch {
      toast.error('Failed to create chat');
      setChattingIndex(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {decisions.map((d, i) => (
        <Card key={i} className="flex flex-col gap-1 p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-muted-foreground size-4 shrink-0" />
              <span className="text-sm font-medium">{d.topic}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              loading={chattingIndex === i}
              disabled={chattingIndex === i}
              onClick={() => handleStartChat(i, d.topic)}
            >
              <MessageCircle className="size-3.5" />
              Discover
            </Button>
          </div>
          <div className="flex items-start gap-2 pl-6 text-sm">
            <Check className="mt-0.5 size-3.5 shrink-0 text-green-500" />
            <span className="leading-relaxed">{d.chosen}</span>
          </div>
          {d.rationale && (
            <p className="text-muted-foreground pl-6 text-xs leading-relaxed">
              {d.rationale}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
};
