import { useEffect } from 'react';

import { Loader2Icon } from 'lucide-react';

import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { createTasks } from '@/modules/tasks/api/createTasks';
import { TaskEntity } from '@/modules/tasks/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';

export const TasksBuilder = ({
  milestone,
  onDone,
}: {
  milestone: MilestoneEntity;
  onDone: (milestone: TaskEntity[]) => void;
}) => {
  const { state, reload } = useLoadableData(createTasks, milestone.id);

  useEffect(() => {
    if (state.type === 'loaded') {
      onDone(state.data);
    }
  }, [state]);

  switch (state.type) {
    case 'loading':
      return (
        <Badge className="mt-2 flex items-center gap-2 bg-yellow-100 text-yellow-800">
          <Loader2Icon className="animate-spin" />
          Tasks creation in the progress...
        </Badge>
      );

    case 'loaded':
      return (
        <Badge className="mt-2 flex items-center gap-2 bg-green-100 text-green-800">
          Success
        </Badge>
      );

    case 'error':
      return (
        <div className={'flex flex-col'}>
          <Badge className="mt-2 mb-2 flex items-center gap-2 bg-red-100 text-red-800">
            Error occurred during tasks creation: {state.error.message}
          </Badge>
          <Button onClick={reload}>Try again</Button>
        </div>
      );

    default:
      return notReachable(state);
  }
};
