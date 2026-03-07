import { useEffect } from 'react';

import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { MilestoneDetailsEntity } from '@/modules/milestones/types/entity';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { startNewMilestoneToday } from '@/modules/timeline/api/startNewMilestoneToday';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

export const StartNewMilestoneForm = ({
  onUpdate,
  project,
}: {
  onUpdate: (milestone: MilestoneDetailsEntity | null) => void;
  project: ProjectPreviewEntity;
}) => {
  const { mutate, status, data, error } = useMutation<
    MilestoneDetailsEntity | null,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: (projectId) => startNewMilestoneToday(projectId),
  });

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(
          `Failed to submit: ${error!.response?.data.message || error!.message}`,
        );
        break;

      case 'success':
        onUpdate(data!);
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

  return (
    <Button loading={status === 'pending'} onClick={() => mutate(project.id)}>
      Start New Milestone
    </Button>
  );
};
