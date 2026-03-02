import { useCallback, useState } from 'react';
import { useParams } from 'react-router';

import { queryKeys } from '@/lib/queryKeys';
import {
  ChatConversation,
  type ProposalRevert,
} from '@/modules/chat/components/ChatConversation';
import { ProjectPageLoader } from '@/modules/projects/components/ProjectPageLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { SoulQueueSnackbar } from '@/modules/soul/components/SoulQueueSnackbar';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';
import { useQueryClient } from '@tanstack/react-query';

export const ChatViewPage = () => {
  const { projectId, chatId } = useParams<{
    projectId: string;
    chatId: string;
  }>();

  if (!projectId) {
    return <ProjectNotFound />;
  }

  if (!chatId) return null;

  return (
    <ProjectPageLoader projectId={projectId}>
      {(props) => <ChatViewContent {...props} chatId={chatId} />}
    </ProjectPageLoader>
  );
};

const ChatViewContent = ({
  project,
  setProject,
  chatId,
}: {
  project: ProjectEntity;
  reload: () => void;
  setProject: (project: ProjectEntity) => void;
  chatId: string;
}) => {
  const queryClient = useQueryClient();
  const [proposalToRevert, setProposalToRevert] =
    useState<ProposalRevert | null>(null);

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

  const handleApplyProposalReverted = useCallback(
    (messageId: string, proposalId: string) => {
      setProposalToRevert({ messageId, proposalId });
    },
    [],
  );

  return (
    <>
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
              onProjectUpdated={handleProjectChanged}
              proposalToRevert={proposalToRevert}
            />
          </div>
        </div>
      </PageTemplate>
      <SoulQueueSnackbar
        project={project}
        onApplyProposalReverted={handleApplyProposalReverted}
      />
    </>
  );
};
