import { useCallback, useEffect, useMemo, useState } from 'react';

import type { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { BookOpen, MessageCircle } from 'lucide-react';

import { queryKeys } from '@/lib/queryKeys';
import { getChats } from '@/modules/chat/api/getChats';
import type {
  ChatContext,
  ChatPreviewEntity,
} from '@/modules/chat/types/entity';
import { CompleteMilestoneForm } from '@/modules/milestones/components/CompleteMilestoneForm';
import { MilestoneChatDialog } from '@/modules/milestones/components/MilestoneChatDialog';
import { MilestoneStatusBadge } from '@/modules/milestones/components/MilestoneStatus';
import { MilestoneStepsList } from '@/modules/milestones/components/MilestoneStepsList';
import type {
  MilestoneDetailsEntity,
  MilestoneEntity,
} from '@/modules/milestones/types/entity';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { Separator } from '@/ui/separator';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const FocusMilestoneCard = ({
  milestone,
  onUpdated,
}: {
  milestone: MilestoneDetailsEntity;
  onUpdated: (milestone: MilestoneEntity) => void;
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
    queryKey: queryKeys.chats.byProject(milestone.projectId),
    queryFn: ({ signal }) => getChats(milestone.projectId, { signal }),
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

  const refetchMilestone = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.milestones.detail(milestone.id),
    });
  }, [queryClient, milestone.id]);

  const handleChatClosed = useCallback(() => {
    refetchMilestone();
    queryClient.invalidateQueries({
      queryKey: queryKeys.chats.byProject(milestone.projectId),
    });
    setChatOpen(false);
    setTimeout(() => {
      refetchMilestone();
      onUpdated(milestone);
    }, 3000);
  }, [refetchMilestone, queryClient, milestone, onUpdated]);

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
    <Card key={currentMilestone.id} className={'justify-between gap-4 p-4'}>
      <div
        className={
          'mb-2 flex flex-col items-start justify-between gap-2 md:flex-row'
        }
      >
        <div>
          <div className={'text-lg font-semibold'}>
            {currentMilestone.title}
          </div>
          <div
            className={
              'text-muted-foreground flex flex-col lg:h-5 lg:flex-row lg:items-center lg:gap-4'
            }
          >
            <span>{currentMilestone.phase.title}</span>
            <Separator orientation={'vertical'} className={'h-4'} />
            <span>Milestone {currentMilestone.orderIndex}</span>
            <Separator orientation={'vertical'} className={'h-4'} />
            <span>
              Day {dayjs().diff(currentMilestone.startedAt, 'days') + 1} out of{' '}
              {currentMilestone.daysNeeded}
            </span>
          </div>
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
        <div className={''}>{milestone.description}</div>
      </div>

      <div className={'flex flex-col gap-4'}>
        <div className={'rounded-lg border-2 border-green-600 p-2 px-4'}>
          <b className={''}>Definition of done:</b>{' '}
          <span>{milestone.definitionOfDone}</span>
        </div>

        {currentMilestone.steps.length > 0 && (
          <Card className={'w-full gap-2 p-4'}>
            <MilestoneStepsList
              milestone={currentMilestone}
              onUpdated={(updated) => {
                setCurrentMilestone((prev) => ({ ...prev, ...updated }));
                onUpdated(updated);
              }}
              onStepChat={openStepChat}
              onOpenChat={(chatId) => {
                const chat = chatsQuery.data?.find((c) => c.id === chatId);
                if (chat) openExistingChat(chat);
              }}
              chats={chatsQuery.data ?? []}
            />
          </Card>
        )}

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

        {milestone.usefulResources && (
          <Card className={'w-full gap-2 p-4'}>
            <div className={'font-semibold'}>Useful resources:</div>
            <MarkdownFormat>{milestone.usefulResources}</MarkdownFormat>
          </Card>
        )}
      </div>

      <div className={'flex flex-col gap-2'}>
        {milestone.status !== 'completed' && (
          <CompleteMilestoneForm milestone={milestone} onUpdate={onUpdated} />
        )}
      </div>

      <MilestoneChatDialog
        projectId={milestone.projectId}
        context={chatContext}
        chatId={selectedChatId}
        initialMessage={chatInitialMessage}
        open={chatOpen}
        onClose={handleChatClosed}
      />
    </Card>
  );
};
