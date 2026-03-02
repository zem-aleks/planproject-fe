import { useEffect, useState } from 'react';

import {
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
import { removeFromSoulQueue } from '@/modules/soul/api/removeFromSoulQueue';
import { Button } from '@/ui/button';
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
      return `Chat proposal: ${truncate(op.description, 60)}`;
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
  const { soulQueue, soulQueueStartedAt, soulQueueApplying } = project;
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(QUEUE_DURATION_S);
  const [applyingManually, setApplyingManually] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const isApplying = soulQueueApplying || applyingManually;

  const invalidateProject = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.projects.detail(project.id),
    });
  };

  // Poll while backend is applying until it finishes
  useEffect(() => {
    if (!soulQueueApplying) return;

    const interval = setInterval(() => {
      invalidateProject();
    }, 3000);

    return () => clearInterval(interval);
  }, [soulQueueApplying]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!soulQueueStartedAt || soulQueue.length === 0 || isApplying) return;

    const startTime = new Date(soulQueueStartedAt).getTime();

    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, QUEUE_DURATION_S - elapsed);
      const pct = Math.min((elapsed / QUEUE_DURATION_S) * 100, 100);

      setProgress(pct);
      setRemainingSeconds(Math.ceil(remaining));

      if (remaining <= 0) {
        invalidateProject();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [soulQueueStartedAt, soulQueue.length, isApplying]); // eslint-disable-line react-hooks/exhaustive-deps

  if (soulQueue.length === 0 && !isApplying) return null;

  const handleApplyNow = async () => {
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
      toast.error('Failed to apply queue');
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
      if (op.type === 'apply_proposal') {
        onApplyProposalReverted?.(op.messageId, op.proposalId);
      }
      queryClient.setQueryData(queryKeys.projects.detail(project.id), updated);
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 w-full max-w-lg">
      <div className="bg-card rounded-xl border opacity-80 shadow-lg transition-opacity duration-200 focus-within:opacity-100 hover:opacity-100">
        {/* Collapsed bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ListChecks className="text-muted-foreground size-4" />
            <span>
              {soulQueue.length} change{soulQueue.length !== 1 && 's'} queued
            </span>
          </div>

          {isApplying ? (
            <div className="text-muted-foreground flex flex-1 items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" />
              <span>Applying changes…</span>
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
                  Apply Now
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
