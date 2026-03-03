import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import type { AxiosError } from 'axios';
import { MessageCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/queryKeys';
import { createChat } from '@/modules/chat/api/createChat';
import { deleteChat } from '@/modules/chat/api/deleteChat';
import { getChats } from '@/modules/chat/api/getChats';
import type {
  ChatContext,
  ChatPreviewEntity,
} from '@/modules/chat/types/entity';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const ChatPage = () => {
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
        title: 'Chats',
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ChatListContent projectId={project.id} />
      </div>
    </PageTemplate>
  );
};

const ChatListContent = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.chats.byProject(projectId);
  const { data, status } = useQuery<ChatPreviewEntity[], AxiosError<Error>>({
    queryKey,
    queryFn: ({ signal }) => getChats(projectId, { signal }),
  });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setCreating(true);
    try {
      const chat = await createChat(projectId);
      navigate(`/project/${projectId}/chat/${chat.id}`);
    } catch {
      toast.error('Failed to create chat');
      setCreating(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, chat: ChatPreviewEntity) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(chat.id);
    try {
      await deleteChat({ projectId, chatId: chat.id });
      if (status === 'success') {
        queryClient.setQueryData(
          queryKey,
          data!.filter((c) => c.id !== chat.id),
        );
      }
    } catch {
      toast.error('Failed to delete chat');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const contextTypeLabel = (type: ChatContext['type']): string | null => {
    switch (type) {
      case 'open_question':
        return 'Open Question';
      case 'workstream':
        return 'Workstream';
      case 'assumption':
        return 'Assumption';
      case 'decision':
        return 'Decision';
      case 'desired_outcome':
        return 'Desired Outcome';
      case 'constraint':
        return 'Constraint';
      case 'resource':
        return 'Resource';
      case 'target_user':
        return 'Target User';
      case 'project_context':
        return 'Project Context';
      default:
        return null;
    }
  };

  const renderList = (chats: ChatPreviewEntity[]) => (
    <>
      {chats.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 py-16">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <MessageCircle className="text-muted-foreground size-8" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-medium">No chats yet</p>
            <p className="text-muted-foreground text-sm">
              Create your first chat to get started
            </p>
          </div>
          <Button onClick={handleCreate} loading={creating} size="sm">
            <Plus className="size-4" />
            New Chat
          </Button>
        </Card>
      ) : (
        <Card className="flex flex-col gap-0 divide-y overflow-hidden p-0">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              to={`/project/${projectId}/chat/${chat.id}`}
              className="group hover:bg-accent flex items-center gap-3 px-5 py-4 transition-colors"
            >
              <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full">
                <MessageCircle className="size-4" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium">
                  {chat.name || 'New chat'}
                </span>
                {chat.context && contextTypeLabel(chat.context.type) && (
                  <div className="flex min-w-0 items-center gap-1.5">
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {contextTypeLabel(chat.context.type)}
                    </Badge>
                    {chat.context.label && (
                      <span className="text-muted-foreground truncate text-xs">
                        {chat.context.label}
                      </span>
                    )}
                  </div>
                )}
                <span className="text-muted-foreground text-xs">
                  {formatDate(chat.updatedAt)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDelete(e, chat)}
                loading={deletingId === chat.id}
                className="text-muted-foreground hover:text-destructive shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </Button>
            </Link>
          ))}
        </Card>
      )}
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Chats</h1>
        <Button onClick={handleCreate} loading={creating} size="sm">
          <Plus className="size-4" />
          New Chat
        </Button>
      </div>

      {(() => {
        switch (status) {
          case 'pending':
            return (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            );

          case 'success':
            return renderList(data!);

          case 'error':
            return (
              <Card className="flex items-center justify-center p-8">
                <p className="text-muted-foreground text-sm">
                  Failed to load chats
                </p>
              </Card>
            );

          default:
            return notReachable(status);
        }
      })()}
    </>
  );
};
