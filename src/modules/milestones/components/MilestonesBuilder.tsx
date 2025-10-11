import { useEffect } from 'react';

import { Loader2Icon } from 'lucide-react';

import { createMilestones } from '@/modules/milestones/api/createMilestones';
import {
  PhaseEntity,
  PhaseEntityWithMilestones,
} from '@/modules/phases/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';

export const MilestonesBuilder = ({
  phase,
  onDone,
}: {
  phase: PhaseEntity;
  onDone: (phase: PhaseEntityWithMilestones) => void;
}) => {
  const { state, reload } = useLoadableData(createMilestones, phase.id);

  useEffect(() => {
    if (state.type === 'loaded') {
      onDone(state.data);
    }
  }, [state]);

  switch (state.type) {
    case 'loading':
      return (
        <Badge variant={'warning'} className="mt-2 flex items-center gap-2">
          <Loader2Icon className="animate-spin" />
          Milestones development in the progress...
        </Badge>
      );

    case 'loaded':
      return (
        <Badge variant={'success'} className="mt-2 flex items-center gap-2">
          Success
        </Badge>
      );

    case 'error':
      return (
        <div className={'flex flex-col'}>
          <Badge className="mt-2 mb-2 flex items-center gap-2 bg-red-100 text-red-800">
            Error occurred during milestones creation: {state.error.message}
          </Badge>
          <Button onClick={reload}>Try again</Button>
        </div>
      );

    default:
      return notReachable(state);
  }
};
