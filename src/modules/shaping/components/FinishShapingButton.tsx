import { useEffect } from 'react';

import { toast } from 'sonner';

import { ProjectEntity } from '@/modules/projects/types/entity';
import { finishShaping } from '@/modules/shaping/api/finishShaping';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

export const FinishShapingButton = ({
  shaping,
  onFinish,
}: {
  shaping: ShapingEntity;
  onFinish: (project: ProjectEntity) => void;
}) => {
  const { status, data, mutate } = useMutation({
    mutationFn: (shapingId: string) => finishShaping(shapingId),
  });

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(`Failed the shaping processing. Please try again.`);
        break;

      case 'success':
        onFinish(data!);
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

  if (shaping.score < 90 || status === 'success') {
    return null;
  }

  return (
    <Button
      className={'bg-green-600 text-white hover:bg-green-800'}
      loading={status === 'pending'}
      onClick={() => mutate(shaping.id)}
    >
      Finish
    </Button>
  );
};
