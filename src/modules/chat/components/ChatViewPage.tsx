import { useParams } from 'react-router';

import { ChatConversation } from '@/modules/chat/components/ChatConversation';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate';

export const ChatViewPage = () => {
  const { project } = useProjectByUrlParam();
  const { chatId } = useParams<{ chatId: string }>();

  if (!project) {
    return <ProjectNotFound />;
  }

  if (!chatId) return null;

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
        <div className="flex min-h-[calc(100vh-12rem)] w-full overflow-hidden rounded-xl border bg-white shadow-sm">
          <ChatConversation projectId={project.id} chatId={chatId} />
        </div>
      </div>
    </PageTemplate>
  );
};
