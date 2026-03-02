import { useEffect } from 'react';

import { toast } from 'sonner';

import { useLazyMutation } from '@/lib/adapters';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { finishShaping } from '@/modules/shaping/api/finishShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';

export const FinishShapingButton = ({
  shaping,
  onFinish,
}: {
  shaping: ShapingEntity;
  onFinish: (project: ProjectEntity) => void;
}) => {
  const { state, load } = useLazyMutation({ mutationFn: finishShaping });

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(`Failed the shaping processing. Please try again.`);
        break;

      case 'loaded':
        onFinish(state.data);
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  if (shaping.score < 90 || state.type === 'loaded') {
    return null;
  }

  return (
    <Button
      className={'bg-green-600 text-white hover:bg-green-800'}
      loading={state.type === 'loading'}
      onClick={() => load(shaping.id)}
    >
      Finish
    </Button>
  );
};
