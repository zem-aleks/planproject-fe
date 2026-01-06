import { useEffect } from 'react';

import { toast } from 'sonner';

import { ProjectEntity } from '@/modules/projects/types/entity';
import { startNewMilestoneToday } from '@/modules/timeline/api/startNewMilestoneToday';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const StartNewMilestoneForm = ({
  onUpdate,
  project,
}: {
  onUpdate: () => void;
  project: ProjectEntity;
}) => {
  const { load, state } = useLazyLoadableData(startNewMilestoneToday);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(
          `Failed to submit: ${state.error.response?.data.message || state.error.message}`,
        );
        break;

      case 'loaded':
        onUpdate();
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  return (
    <Button loading={state.type === 'loading'} onClick={() => load(project.id)}>
      Start New Milestone
    </Button>
  );
};
