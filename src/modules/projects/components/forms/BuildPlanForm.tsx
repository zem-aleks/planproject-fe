import { useEffect, useState } from 'react';

import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { buildPlan } from '@/modules/projects/api/buildPlan';
import type {
  ProjectEntity,
  ProjectPreviewEntity,
} from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip';
import { notReachable } from '@/utils/notReachable';
import { IconLayoutKanban } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

export const BuildPlanForm = ({
  project,
  onPlanBuilt,
}: {
  project: ProjectPreviewEntity;
  onPlanBuilt: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const isPlanning = project.status === 'planning';
  const isRegenerate =
    project.status === 'planningError' ||
    project.status === 'analyzing' ||
    project.status === 'active';
  const hasQueuedChanges = project.soulQueue.length > 0;

  const { status, error, mutate } = useMutation<
    ProjectEntity,
    AxiosError<{ message: string }>,
    string
  >({ mutationFn: (projectId) => buildPlan(projectId) });

  const isPending = status === 'pending' || isPlanning;

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(
          `Failed to build the plan: ${error!.response?.data.message || error!.message}`,
        );
        break;

      case 'success':
        onPlanBuilt();
        setOpen(false);
        toast.success('Plan generation started!');
        break;

      default:
        return notReachable(status);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <BuildPlanModal
        open={open}
        onClose={() => setOpen(false)}
        isRegenerate={isRegenerate}
        isPending={isPending}
        onConfirm={() => mutate(project.id)}
      />
      {(!isRegenerate || isPlanning) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="w-full">
              <Button
                className="relative w-full animate-[glow_2s_ease_infinite] shadow shadow-white"
                disabled={hasQueuedChanges || isPending}
                onClick={() => setOpen(true)}
              >
                {isPending ? 'Planning in progress…' : 'Do Planning'}
              </Button>
            </span>
          </TooltipTrigger>
          {hasQueuedChanges && (
            <TooltipContent>
              Apply or revert queued changes before planning
            </TooltipContent>
          )}
        </Tooltip>
      )}
    </>
  );
};

const BuildPlanModal = ({
  open,
  isRegenerate,
  isPending,
  onConfirm,
  onClose,
}: {
  open: boolean;
  isRegenerate: boolean;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      modal={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">
            <IconLayoutKanban className="mb-2 size-8" />
            {isRegenerate ? 'Regenerate Plan' : 'Build Plan'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground w-full">
            {isRegenerate
              ? 'This will wipe all existing phases and milestones, then regenerate them from the project profile. Are you sure?'
              : 'This will generate project phases and milestones based on the project profile. You can review and start the project after.'}
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <>
            <div className="text-center text-sm text-orange-400">
              Plan generation is in progress. You can safely close this dialog —
              it will continue in the background.
            </div>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={onConfirm}>
            {isRegenerate ? 'Regenerate' : "Let's plan!"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};
