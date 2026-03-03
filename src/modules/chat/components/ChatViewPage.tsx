import { useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { queryKeys } from '@/lib/queryKeys';
import { ChatConversation } from '@/modules/chat/components/ChatConversation';
import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { useProjectLayoutContext } from '@/routing/components/ProjectLayout';
import { useQueryClient } from '@tanstack/react-query';

export const ChatViewPage = () => {
  const { projectId, chatId } = useParams<{
    projectId: string;
    chatId: string;
  }>();
  const [searchParams] = useSearchParams();
  const initialMessage = searchParams.get('message');

  if (!projectId) {
    return <ProjectNotFound />;
  }

  if (!chatId) return null;

  return (
    <ProjectPageLoader projectId={projectId}>
      {(props) => (
        <ChatViewContent
          {...props}
          chatId={chatId}
          initialMessage={initialMessage}
        />
      )}
    </ProjectPageLoader>
  );
};

const ChatViewContent = ({
  project,
  setProject,
  chatId,
  initialMessage,
}: {
  project: ProjectEntity;
  reload: () => void;
  setProject: (project: ProjectEntity) => void;
  chatId: string;
  initialMessage?: string | null;
}) => {
  const queryClient = useQueryClient();
  const { proposalToRevert } = useProjectLayoutContext();

  const handleProjectChanged = useCallback(
    (updated?: ProjectEntity) => {
      if (updated) {
        setProject(updated);
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.detail(project.id),
        });
      }
    },
    [setProject, queryClient, project.id],
  );

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: project.title, href: `/project/${project.id}` },
          { title: 'Chats', href: `/project/${project.id}/chat` },
        ],
        title: 'Chat',
      }}
    >
      <div className="flex flex-1 p-4 pt-0">
        <div className="bg-card flex min-h-[calc(100vh-12rem)] w-full overflow-hidden rounded-xl border shadow-sm">
          <ChatConversation
            projectId={project.id}
            chatId={chatId}
            initialMessage={initialMessage}
            onProjectUpdated={handleProjectChanged}
            proposalToRevert={proposalToRevert}
          />
        </div>
      </div>
    </PageTemplate>
  );
};
