import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

import type { AxiosError } from 'axios';
import { Layers, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/queryKeys';
import { createChat } from '@/modules/chat/api/createChat';
import { getChats } from '@/modules/chat/api/getChats';
import type { ChatPreviewEntity } from '@/modules/chat/types/entity';
import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type {
  ProjectPreviewEntity,
  ProjectSoul,
} from '@/modules/projects/types/entity';
import { DiscoverButton } from '@/modules/soul/components/DiscoverButton';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { useQuery } from '@tanstack/react-query';

export const WorkstreamsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
      <ProjectPageLoader projectId={projectId}>
        {({ project }) => (
          <WorkstreamsContent project={project} projectId={projectId} />
        )}
      </ProjectPageLoader>
    </ActiveProjectGuard>
  );
};

const WorkstreamsContent = ({
  project,
  projectId,
}: {
  project: ProjectPreviewEntity;
  projectId: string;
}) => {
  const soul = project.soul;

  const priorityOrder = { must: 0, should: 1, 'nice-to-have': 2 } as const;
  const sorted = soul
    ? [...soul.workstreams].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      )
    : [];

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
        ],
        title: 'Workstreams',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-2xl font-semibold text-white">Workstreams</h1>
            <div className="text-gray-200">
              Review and manage your project workstreams
            </div>
          </div>
          <DiscoverButton projectId={projectId} contextType="workstream" />
        </div>

        {sorted.length > 0 ? (
          <WorkstreamsList soul={soul!} sorted={sorted} projectId={projectId} />
        ) : (
          <Card className="p-5">
            <p className="text-muted-foreground text-sm">No workstreams</p>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};

const PriorityBadge = ({
  priority,
}: {
  priority: 'must' | 'should' | 'nice-to-have';
}) => {
  switch (priority) {
    case 'must':
      return <Badge variant="default">must</Badge>;
    case 'should':
      return <Badge variant="secondary">should</Badge>;
    case 'nice-to-have':
      return <Badge variant="outline">nice-to-have</Badge>;
  }
};

const WorkstreamsList = ({
  sorted,
  projectId,
}: {
  soul: ProjectSoul;
  sorted: ProjectSoul['workstreams'];
  projectId: string;
}) => {
  const navigate = useNavigate();
  const [chattingIndex, setChattingIndex] = useState<number | null>(null);

  const { data: chats } = useQuery<ChatPreviewEntity[], AxiosError<Error>>({
    queryKey: queryKeys.chats.byProject(projectId),
    queryFn: ({ signal }) => getChats(projectId, { signal }),
  });

  const chatsByWorkstream = useMemo(() => {
    if (!chats) return new Map<string, ChatPreviewEntity[]>();
    const map = new Map<string, ChatPreviewEntity[]>();
    for (const chat of chats) {
      if (chat.context?.type === 'workstream' && chat.context.entityId) {
        const existing = map.get(chat.context.entityId) ?? [];
        existing.push(chat);
        map.set(chat.context.entityId, existing);
      }
    }
    return map;
  }, [chats]);

  const handleStartChat = async (index: number, name: string) => {
    setChattingIndex(index);
    try {
      const chat = await createChat(projectId, {
        type: 'workstream',
        entityId: name,
        label: name,
      });
      navigate(`/project/${projectId}/chat/${chat.id}`);
    } catch {
      toast.error('Failed to create chat');
      setChattingIndex(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((ws, i) => {
        const wsChats = chatsByWorkstream.get(ws.name) ?? [];
        return (
          <Card key={i} className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <Layers className="text-muted-foreground size-4 shrink-0" />
                  <span className="text-sm font-medium">{ws.name}</span>
                  {ws.inferred && (
                    <Badge variant="outline" className="text-[10px]">
                      Suggested
                    </Badge>
                  )}
                  <PriorityBadge priority={ws.priority} />
                </div>
                <p className="text-muted-foreground pl-6 text-xs leading-relaxed">
                  {ws.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  loading={chattingIndex === i}
                  disabled={chattingIndex === i}
                  onClick={() => handleStartChat(i, ws.name)}
                >
                  <MessageCircle className="size-3.5" />
                  Discover
                </Button>
              </div>
            </div>

            {wsChats.length > 0 && (
              <div className="flex flex-col gap-1.5 pl-6">
                <span className="text-muted-foreground text-xs font-medium">
                  {wsChats.length} {wsChats.length === 1 ? 'chat' : 'chats'}
                </span>
                {wsChats.map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/project/${projectId}/chat/${chat.id}`}
                    className="hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors"
                  >
                    <MessageCircle className="text-muted-foreground size-3.5 shrink-0" />
                    <span className="truncate text-xs">
                      {chat.name || 'New chat'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
