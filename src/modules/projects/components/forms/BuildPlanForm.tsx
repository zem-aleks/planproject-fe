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

  const isRegenerate =
    project.status === 'analyzing' || project.status === 'active';

  return (
    <>
      <BuildPlanModal
        open={open}
        onClose={() => setOpen(false)}
        project={project}
        isRegenerate={isRegenerate}
        onPlanBuilt={() => {
          onPlanBuilt();
          setOpen(false);
        }}
      />
      {isRegenerate ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setOpen(true)}
        >
          Regenerate Plan
        </Button>
      ) : (
        <Button
          className="relative w-full animate-[glow_2s_ease_infinite] shadow shadow-white"
          onClick={() => setOpen(true)}
        >
          Do Planning
        </Button>
      )}
    </>
  );
};

const BuildPlanModal = ({
  open,
  project,
  isRegenerate,
  onPlanBuilt,
  onClose,
}: {
  open: boolean;
  project: ProjectPreviewEntity;
  isRegenerate: boolean;
  onPlanBuilt: () => void;
  onClose: () => void;
}) => {
  const { status, error, mutate } = useMutation<
    ProjectEntity,
    AxiosError<{ message: string }>,
    string
  >({ mutationFn: (projectId) => buildPlan(projectId) });

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
        toast.success('Plan generation started!');
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

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

        <Button
          className="w-full"
          loading={status === 'pending'}
          onClick={() => mutate(project.id)}
        >
          {isRegenerate ? 'Regenerate' : "Let's plan!"}
        </Button>
        {status === 'pending' && (
          <div className="text-center text-sm text-orange-400">
            This may take some time. Plan generation is in progress...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
