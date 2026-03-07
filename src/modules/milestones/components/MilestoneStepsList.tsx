import { useEffect, useMemo, useState } from 'react';

import type { AxiosError } from 'axios';
import { MessageCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import type { ChatPreviewEntity } from '@/modules/chat/types/entity';
import { toggleStep } from '@/modules/milestones/api/toggleStep';
import type {
  MilestoneEntity,
  MilestoneStep,
} from '@/modules/milestones/types/entity';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

export const MilestoneStepsList = ({
  milestone,
  onUpdated,
  onStepChat,
  onOpenChat,
  chats,
}: {
  milestone: MilestoneEntity;
  onUpdated: (milestone: MilestoneEntity) => void;
  onStepChat?: (step: { id: string; title: string }) => void;
  onOpenChat?: (chatId: string) => void;
  chats?: ChatPreviewEntity[];
}) => {
  const { mutate, status, data, error, reset } = useMutation<
    MilestoneEntity,
    AxiosError<{ message: string }>,
    { milestoneId: string; stepId: string }
  >({
    mutationFn: (params) => toggleStep(params),
  });
  const [togglingStepId, setTogglingStepId] = useState<string | null>(null);

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'success':
        onUpdated(data!);
        setTogglingStepId(null);
        reset();
        break;

      case 'error':
        toast.error(
          `Failed to toggle step: ${error!.response?.data.message || error!.message}`,
        );
        setTogglingStepId(null);
        reset();
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

  const handleToggle = (stepId: string) => {
    setTogglingStepId(stepId);
    mutate({ milestoneId: milestone.id, stepId });
  };

  const completedCount = milestone.steps.filter((s) => s.completed).length;

  const chatsByStep = useMemo(() => {
    if (!chats) return {};
    const grouped: Record<string, ChatPreviewEntity[]> = {};
    for (const chat of chats) {
      if (chat.context?.type === 'task' && chat.context.entityId) {
        const key = chat.context.entityId;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(chat);
      }
    }
    return grouped;
  }, [chats]);

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex items-center justify-between'}>
        <div className={'font-semibold'}>Steps:</div>
        <div className={'text-muted-foreground text-sm'}>
          {completedCount}/{milestone.steps.length} completed
        </div>
      </div>

      <div className={'flex flex-col gap-1'}>
        {milestone.steps.map((step) => (
          <StepItem
            key={step.id}
            step={step}
            disabled={togglingStepId !== null}
            loading={togglingStepId === step.id}
            onToggle={() => handleToggle(step.id)}
            onChat={onStepChat ? () => onStepChat(step) : undefined}
            onOpenChat={onOpenChat}
            stepChats={chatsByStep[step.id] ?? []}
          />
        ))}
      </div>
    </div>
  );
};

const StepItem = ({
  step,
  disabled,
  loading,
  onToggle,
  onChat,
  onOpenChat,
  stepChats,
}: {
  step: MilestoneStep;
  disabled: boolean;
  loading: boolean;
  onToggle: () => void;
  onChat?: () => void;
  onOpenChat?: (chatId: string) => void;
  stepChats: ChatPreviewEntity[];
}) => {
  return (
    <div
      className={`flex flex-col rounded-lg border transition-colors ${
        step.completed
          ? 'border-green-600/30 bg-green-600/10'
          : 'border-border bg-card'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3 p-3">
        <label
          className={`flex min-w-0 flex-1 cursor-pointer items-start gap-3 ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <Checkbox
            checked={step.completed}
            onCheckedChange={onToggle}
            disabled={disabled}
            className={'mt-0.5'}
          />
          <div className={'flex flex-col gap-0.5'}>
            <span
              className={`text-sm font-medium ${step.completed ? 'text-muted-foreground line-through' : ''}`}
            >
              {step.title}
            </span>
            {step.description && (
              <span className={'text-muted-foreground text-xs'}>
                {step.description}
              </span>
            )}
          </div>
        </label>
        <div className="flex shrink-0 items-center gap-1 self-center">
          {loading && (
            <div
              className={
                'border-primary size-4 animate-spin rounded-full border-2 border-t-transparent'
              }
            />
          )}
          {onChat && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onChat();
              }}
            >
              <Sparkles className="size-3" />
              Help me
            </Button>
          )}
        </div>
      </div>

      {stepChats.length > 0 && (
        <div className="border-t px-3 py-2">
          <div className="flex flex-col gap-1">
            {stepChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => onOpenChat?.(chat.id)}
                className="hover:bg-accent/50 flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors"
              >
                <MessageCircle className="text-muted-foreground size-3 shrink-0" />
                <span className="truncate text-xs font-medium">
                  {chat.name || 'New chat'}
                </span>
                <span className="text-muted-foreground ml-auto shrink-0 text-[10px]">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
