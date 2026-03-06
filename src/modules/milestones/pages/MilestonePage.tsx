import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import type { AxiosError } from 'axios';
import { BookOpen, MessageCircle } from 'lucide-react';

import { queryKeys } from '@/lib/queryKeys';
import { getChats } from '@/modules/chat/api/getChats';
import type {
  ChatContext,
  ChatPreviewEntity,
} from '@/modules/chat/types/entity';
import { getMilestone } from '@/modules/milestones/api/getMilestone';
import { CompleteMilestoneForm } from '@/modules/milestones/components/CompleteMilestoneForm';
import { MilestoneChatDialog } from '@/modules/milestones/components/MilestoneChatDialog';
import { MilestoneStatusBadge } from '@/modules/milestones/components/MilestoneStatus';
import { MilestoneStepsList } from '@/modules/milestones/components/MilestoneStepsList';
import type {
  MilestoneDetailsEntity,
  MilestoneEntity,
} from '@/modules/milestones/types/entity';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const MilestonePage = () => {
  const { project } = useProjectByUrlParam();
  const { milestoneId } = useParams<{ milestoneId: string }>();
  if (!project || project.status === 'draft' || !milestoneId) {
    return <ProjectNotFound />;
  }

  return <PageContent project={project} milestoneId={milestoneId} />;
};

const PageContent = ({
  project,
  milestoneId,
}: {
  project: ProjectPreviewEntity;
  milestoneId: string;
}) => {
  const { data, status, refetch } = useQuery<
    MilestoneDetailsEntity,
    AxiosError<Error>
  >({
    queryKey: queryKeys.milestones.detail(milestoneId),
    queryFn: ({ signal }) => getMilestone(milestoneId, { signal }),
  });
  switch (status) {
    case 'pending':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [
              { title: 'Projects', href: '/projects' },
              { title: `${project.title}`, href: `/project/${project.id}` },
            ],
            title: `Loading the milestone...`,
          }}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 pt-0">
            <div className={'text-xl text-white'}>Loading...</div>
            <Spinner className={'size-20 text-white'} />
          </div>
        </PageTemplate>
      );

    case 'success':
      return (
        <LoadedContentPage
          project={project}
          milestone={data!}
          onChanged={() => refetch()}
        />
      );

    case 'error':
      return (
        <PageTemplate
          header={{
            breadcrumbs: [
              { title: 'Projects', href: '/projects' },
              { title: `${project.title}`, href: `/project/${project.id}` },
            ],
            title: `Error`,
          }}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 pt-0">
            <div className={'text-xl text-white'}>Something went wrong</div>
            <Button onClick={() => refetch()} size={'lg'}>
              Try again
            </Button>
          </div>
        </PageTemplate>
      );

    default:
      return notReachable(status);
  }
};

const LoadedContentPage = ({
  project,
  milestone,
  onChanged,
}: {
  project: ProjectPreviewEntity;
  milestone: MilestoneDetailsEntity;
  onChanged: () => void;
}) => {
  const queryClient = useQueryClient();
  const [currentMilestone, setCurrentMilestone] = useState(milestone);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<ChatContext>({
    type: 'milestone',
    entityId: milestone.id,
    label: milestone.title,
  });
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setCurrentMilestone(milestone);
  }, [milestone]);

  const chatsQuery = useQuery<ChatPreviewEntity[], AxiosError<Error>>({
    queryKey: queryKeys.chats.byProject(project.id),
    queryFn: ({ signal }) => getChats(project.id, { signal }),
  });

  const milestoneChats = useMemo(
    () =>
      chatsQuery.data?.filter(
        (c) =>
          c.context?.type === 'milestone' &&
          c.context.entityId === milestone.id,
      ) ?? [],
    [chatsQuery.data, milestone.id],
  );

  const handleStepUpdated = (updated: MilestoneEntity) => {
    setCurrentMilestone((prev) => ({ ...prev, ...updated }));
  };

  const handleChatClosed = useCallback(() => {
    onChanged();
    queryClient.invalidateQueries({
      queryKey: queryKeys.chats.byProject(project.id),
    });
    setChatOpen(false);
    // Context update runs async on backend, refetch again after a delay
    setTimeout(() => onChanged(), 3000);
  }, [onChanged, queryClient, project.id]);

  const openMilestoneChat = () => {
    setChatContext({
      type: 'milestone',
      entityId: milestone.id,
      label: milestone.title,
    });
    setSelectedChatId(null);
    setChatInitialMessage(null);
    setChatOpen(true);
  };

  const openExistingChat = (chat: ChatPreviewEntity) => {
    setChatContext(
      chat.context ?? {
        type: 'milestone',
        entityId: milestone.id,
        label: milestone.title,
      },
    );
    setSelectedChatId(chat.id);
    setChatInitialMessage(null);
    setChatOpen(true);
  };

  const openStepChat = (step: { id: string; title: string }) => {
    setChatContext({
      type: 'task',
      entityId: step.id,
      label: step.title,
    });
    setSelectedChatId(null);
    setChatInitialMessage(
      `Help me with this step: "${step.title}". Provide clear instructions or a concrete result I can use right away.`,
    );
    setChatOpen(true);
  };

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: `${project.title}`, href: `/project/${project.id}` },
          {
            title: `${currentMilestone.phase.title}`,
            href: `/project/${project.id}/phase/${currentMilestone.phase.id}`,
          },
        ],
        title: currentMilestone.title,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {currentMilestone.status === 'inProgress' && (
          <DaysCounter
            startedAt={currentMilestone.startedAt}
            daysCount={currentMilestone.daysNeeded}
          />
        )}
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-1">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold text-white'
              }
            >
              {currentMilestone.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={openMilestoneChat}>
              <MessageCircle className="size-4" />
              Chat
            </Button>
            <MilestoneStatusBadge status={currentMilestone.status} />
          </div>
        </div>

        <div className={'flex flex-col gap-2'}>
          <div className={'text-gray-200'}>{currentMilestone.description}</div>
          <div className={'flex items-center gap-1 text-gray-50'}>
            <b>Estimation:</b>
            <Badge>{currentMilestone.daysNeeded} days</Badge>
          </div>
          <div className={'rounded-lg bg-green-600 p-2 px-4 text-gray-200'}>
            <b className={'text-gray-50'}>Definition of done:</b>{' '}
            <span>{currentMilestone.definitionOfDone}</span>
          </div>

          <Card className={'w-full gap-2 p-4'}>
            <MilestoneStepsList
              milestone={currentMilestone}
              onUpdated={handleStepUpdated}
              onStepChat={openStepChat}
              onOpenChat={(chatId) => {
                const chat = chatsQuery.data?.find((c) => c.id === chatId);
                if (chat) openExistingChat(chat);
              }}
              chats={chatsQuery.data ?? []}
            />
          </Card>

          {currentMilestone.context && (
            <Card className={'border-primary/20 w-full gap-3 p-4'}>
              <div className="flex items-center gap-2">
                <div className="bg-primary/15 text-primary flex size-7 items-center justify-center rounded-lg">
                  <BookOpen className="size-4" />
                </div>
                <span className="text-sm font-semibold">Progress Summary</span>
              </div>
              <div className="text-sm leading-relaxed">
                <MarkdownFormat>{currentMilestone.context}</MarkdownFormat>
              </div>
            </Card>
          )}

          <Card className={'w-full gap-2 p-4'}>
            <div className={'font-semibold'}>Useful resources:</div>
            <MarkdownFormat>{currentMilestone.usefulResources}</MarkdownFormat>
          </Card>
        </div>

        {milestoneChats.length > 0 && (
          <Card className={'w-full gap-2 p-4'}>
            <div className={'font-semibold'}>Previous chats:</div>
            <div className={'flex flex-col gap-1'}>
              {milestoneChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => openExistingChat(chat)}
                  className="hover:bg-accent flex items-center gap-2 rounded-lg border p-3 text-left transition-colors"
                >
                  <MessageCircle className="text-muted-foreground size-4 shrink-0" />
                  <span className="truncate text-sm font-medium">
                    {chat.name || 'New chat'}
                  </span>
                  <span className="text-muted-foreground ml-auto shrink-0 text-xs">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        )}

        {currentMilestone.status !== 'completed' && (
          <CompleteMilestoneForm
            milestone={currentMilestone}
            onUpdate={onChanged}
          />
        )}

        {currentMilestone.status === 'completed' &&
          currentMilestone.completeMessage && (
            <Card className={'w-full gap-2 bg-pink-100 p-4'}>
              <div className={'font-semibold'}>Completed with comment:</div>
              <MarkdownFormat>
                {currentMilestone.completeMessage}
              </MarkdownFormat>
            </Card>
          )}

        <MilestoneChatDialog
          projectId={project.id}
          context={chatContext}
          chatId={selectedChatId}
          initialMessage={chatInitialMessage}
          open={chatOpen}
          onClose={handleChatClosed}
        />
      </div>
    </PageTemplate>
  );
};
