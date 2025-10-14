import { useEffect } from 'react';
import { Link } from 'react-router';

import { toast } from 'sonner';

import { startMilestone } from '@/modules/milestones/api/startMilestone';
import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { getTasks } from '@/modules/tasks/api/getTasks';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';
import { useLoadableData } from '@/utils/useLoadableData';

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
      return (
        <div className={'flex flex-col gap-2'}>
          <Button variant="warning" className={'w-full py-2'} asChild>
            <Link
              to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
              className="w-full"
            >
              Tasks
            </Link>
          </Button>
          <Badge variant="success" className={'w-full py-2'}>
            Milestone is completed
          </Badge>
        </div>
      );

    case 'inProgress':
      return <ActionsInProgress milestone={milestone} />;

    default:
      return notReachable(milestone.status);
  }
};

const ActionsInProgress = ({ milestone }: { milestone: MilestoneEntity }) => {
  const { state } = useLoadableData(getTasks, milestone.id);

  switch (state.type) {
    case 'error':
    case 'loading':
      return (
        <Button variant="warning" className={'w-full py-2'} asChild>
          <Link
            to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
            className="w-full"
          >
            Tasks
          </Link>
        </Button>
      );

    case 'loaded':
      return (
        <>
          <Button variant="warning" className={'w-full py-2'} asChild>
            <Link
              to={`/project/${milestone.projectId}/milestone/${milestone.id}`}
              className="w-full"
            >
              Tasks: {state.data.filter((t) => t.status === 'completed').length}{' '}
              / {state.data.length}
            </Link>
          </Button>
        </>
      );

    default:
      return notReachable(state);
  }
};
