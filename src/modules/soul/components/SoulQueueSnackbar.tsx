import { useEffect, useRef, useState } from 'react';

import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ListChecks,
  Loader2,
  Play,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/queryKeys';
import type {
  ProjectPreviewEntity,
  SoulOperation,
} from '@/modules/projects/types/entity';
import { applySoulQueue } from '@/modules/soul/api/applySoulQueue';
import { cancelSoulQueue } from '@/modules/soul/api/cancelSoulQueue';
import { removeFromSoulQueue } from '@/modules/soul/api/removeFromSoulQueue';
import { Button } from '@/ui/button';
import { cn } from '@/ui/lib/utils';
import { Progress } from '@/ui/progress';
import { notReachable } from '@/utils/notReachable';
import { useQueryClient } from '@tanstack/react-query';

const QUEUE_DURATION_S = 300; // 5 minutes

const formatTimeRemaining = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const truncate = (text: string, max: number): string => {
  // Strip markdown syntax and collapse whitespace
  const plain = text
    .replace(/[#*_`~>\\[\]()!]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > max ? `${plain.slice(0, max)}…` : plain;
};

const getOperationLabel = (op: SoulOperation): string => {
  switch (op.type) {
    case 'answer_open_question':
      return `Answer "${op.topic}" with "${op.chosenOption}"`;
    case 'remove_open_question':
      return `Remove question "${op.topic}"`;
    case 'accept_assumption':
      return `Accept assumption "${op.assumption}"`;
    case 'remove_assumption':
      return `Reject assumption "${op.assumption}"`;
    case 'apply_proposal':
    case 'apply_plan_proposal':
      return `Chat proposal: ${truncate(op.description, 60)}`;
    case 'generate_plan':
      return `Generate plan: ${truncate(op.description, 60)}`;
    default:
      return notReachable(op);
  }
};

export const SoulQueueSnackbar = ({
  project,
  onApplyProposalReverted,
}: {
  project: ProjectPreviewEntity;
  onApplyProposalReverted?: (messageId: string, proposalId: string) => void;
}) => {
  const queryClient = useQueryClient();
  const { soulQueue, soulQueueStartedAt, soulQueueApplying, soulQueueError } =
    project;
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(QUEUE_DURATION_S);
  const [applyingManually, setApplyingManually] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [applied, setApplied] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const prevIsApplyingRef = useRef(false);

  const isApplying = soulQueueApplying || applyingManually;

  const invalidateProject = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.detail(project.id),
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.list(),
    });
  };

  // Timer expired but queue not yet cleared — backend is applying or about to
  const timerExpired =
    soulQueue.length > 0 &&
    !isApplying &&
    remainingSeconds === 0 &&
    !!soulQueueStartedAt;

  // Poll while backend is applying (or timer expired awaiting apply) until it finishes
  useEffect(() => {
    if (!soulQueueApplying && !timerExpired) return;

    const interval = setInterval(() => {
      invalidateProject();
    }, 3000);

    return () => clearInterval(interval);
  }, [soulQueueApplying, timerExpired]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      !soulQueueStartedAt ||
      soulQueue.length === 0 ||
      isApplying ||
      applied ||
      soulQueueError ||
      dismissed
    )
      return;

    const startTime = new Date(soulQueueStartedAt).getTime();
    const initialElapsed = (Date.now() - startTime) / 1000;

    // Timer already expired — fire once, don't start interval
    if (initialElapsed >= QUEUE_DURATION_S) {
      setProgress(100);
      setRemainingSeconds(0);
      invalidateProject();
      return;
    }

    setProgress(Math.min((initialElapsed / QUEUE_DURATION_S) * 100, 100));
    setRemainingSeconds(
      Math.ceil(Math.max(0, QUEUE_DURATION_S - initialElapsed)),
    );

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, QUEUE_DURATION_S - elapsed);

      setProgress(Math.min((elapsed / QUEUE_DURATION_S) * 100, 100));
      setRemainingSeconds(Math.ceil(remaining));

      if (remaining <= 0) {
        clearInterval(interval);
        invalidateProject();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    soulQueueStartedAt,
    soulQueue.length,
    isApplying,
    applied,
    soulQueueError,
    dismissed,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Transition detection: isApplying true → false (success only)
  useEffect(() => {
    if (prevIsApplyingRef.current && !isApplying) {
      if (soulQueue.length === 0 && !soulQueueError) {
        setApplied(true);
        // Refresh sidebar counters and other project-dependent views
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.list(),
        });
      }
    }
    prevIsApplyingRef.current = isApplying;
  }, [isApplying, soulQueue.length, soulQueueError]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-dismiss success after 3s
  useEffect(() => {
    if (!applied) return;
    const timeout = setTimeout(() => setApplied(false), 3000);
    return () => clearTimeout(timeout);
  }, [applied]);

  // Clear success when new items arrive
  useEffect(() => {
    if (applied && soulQueue.length > 0) setApplied(false);
  }, [soulQueue.length, applied]);

  // Reset dismissed when queue timer restarts (new items added)
  useEffect(() => {
    setDismissed(false);
  }, [soulQueueStartedAt]);

  if (
    dismissed ||
    (soulQueue.length === 0 && !isApplying && !applied && !soulQueueError)
  )
    return null;

  const handleApplyNow = async () => {
    setApplied(false);
    setDismissed(false);
    setApplyingManually(true);
    try {
      const updated = await applySoulQueue(project.id);
      queryClient.setQueryData(queryKeys.projects.detail(project.id), updated);
      const keysToInvalidate = [
        queryKeys.projects.detail(project.id),
        queryKeys.projects.list(),
        queryKeys.phases.byProject(project.id),
        queryKeys.projects.progress(project.id),
        queryKeys.timeline.today(project.id),
        queryKeys.timeline.history(project.id),
        ['milestones'],
        ['tasks'],
      ];
      keysToInvalidate.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
    } catch {
      // Error state now driven by soulQueueError from backend
    } finally {
      setApplyingManually(false);
    }
  };

  const handleRemove = async (op: SoulOperation) => {
    setRemovingId(op.id);
    try {
      const updated = await removeFromSoulQueue(project.id, {
        operationId: op.id,
      });
      if (
        op.type === 'apply_proposal' ||
        op.type === 'apply_plan_proposal' ||
        op.type === 'generate_plan'
      ) {
        onApplyProposalReverted?.(op.messageId, op.proposalId);
      }
      queryClient.setQueryData(queryKeys.projects.detail(project.id), updated);
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      // Revert all proposal-type operations before clearing
      for (const op of soulQueue) {
        if (
          op.type === 'apply_proposal' ||
          op.type === 'apply_plan_proposal' ||
          op.type === 'generate_plan'
        ) {
          onApplyProposalReverted?.(op.messageId, op.proposalId);
        }
      }
      const updated = await cancelSoulQueue(project.id);
      queryClient.setQueryData(queryKeys.projects.detail(project.id), updated);
    } catch {
      toast.error('Failed to cancel queue');
    } finally {
      setCancelling(false);
    }
  };

  if (applied) {
    return (
      <div className="fixed top-6 right-6 z-50 w-full max-w-lg">
        <div className="bg-card rounded-xl border border-green-500/40 shadow-lg">
          <div className="flex items-center gap-3 px-4 py-3">
            <Check className="size-4 text-green-500" />
            <span className="text-sm font-medium">
              Changes applied successfully
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-6 right-6 z-50 w-full max-w-lg">
      <div
        className={cn(
          'bg-card rounded-xl border opacity-80 shadow-lg transition-opacity duration-200 focus-within:opacity-100 hover:opacity-100',
          soulQueueError && 'border-red-500/40 opacity-100',
        )}
      >
        {/* Collapsed bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ListChecks className="text-muted-foreground size-4" />
            <span>
              {soulQueue.length} change{soulQueue.length !== 1 && 's'} queued
            </span>
          </div>

          {isApplying ? (
            <div className="flex flex-1 items-center justify-between gap-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" />
                <span>Applying changes…</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={cancelling}
                loading={cancelling}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-1 items-center gap-2">
                <Progress value={progress} className="h-1.5" />
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Clock className="size-3" />
                  <span>{formatTimeRemaining(remainingSeconds)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button size="sm" onClick={handleApplyNow}>
                  <Play className="size-3.5" />
                  {soulQueueError ? 'Retry' : 'Apply Now'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => setExpanded((e) => !e)}
                >
                  {expanded ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronUp className="size-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Error banner */}
        {soulQueueError && !isApplying && (
          <div className="border-t border-red-500/20 bg-red-500/10 px-4 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-red-500">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{soulQueueError}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  disabled={cancelling}
                  loading={cancelling}
                  onClick={handleCancel}
                >
                  Cancel All
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0"
                  onClick={() => setDismissed(true)}
                >
                  <X className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Expanded list */}
        {expanded && !isApplying && (
          <div className="border-t px-4 py-3">
            <div className="flex flex-col gap-2">
              {soulQueue.map((op) => (
                <div
                  key={op.id}
                  className="flex items-center justify-between gap-2 rounded-lg border p-2"
                >
                  <span className="text-sm leading-relaxed">
                    {getOperationLabel(op)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    disabled={removingId === op.id}
                    loading={removingId === op.id}
                    onClick={() => handleRemove(op)}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
