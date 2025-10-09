import { useEffect } from 'react';

import { toast } from 'sonner';

import { startMilestone } from '@/modules/milestones/api/startMilestone';
import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const MilestoneActions = ({
  milestone,
  onUpdated,
}: {
  milestone: MilestoneEntity;
  onUpdated: (milestone: MilestoneEntity) => void;
}) => {
  const { state, load } = useLazyLoadableData(startMilestone);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(`Failed to start the milestone. Please try again.`);
        break;

      case 'loaded':
        onUpdated(state.data);
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  switch (milestone.status) {
    case 'notStarted':
      return (
        <Button
          onClick={() => load(milestone.id)}
          loading={state.type === 'loading'}
        >
          Start working on it now
        </Button>
      );

    case 'completed':
    case 'inProgress':
      return null;

    default:
      return notReachable(milestone.status);
  }
};
