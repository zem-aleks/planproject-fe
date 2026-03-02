import { useEffect } from 'react';

import { toast } from 'sonner';

import { completePhase } from '@/modules/phases/api/completePhase';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button';
import { DropdownMenuItem } from '@/ui/dropdown-menu';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

export const CompletePhaseForm = ({
  phase,
  onCompleted,
  variant,
}: {
  phase: PhaseEntity;
  onCompleted: (phase: PhaseEntity) => void;
  variant: 'menuItem' | 'button';
}) => {
  const { status, data, error, mutate } = useMutation({
    mutationFn: (phaseId: string) => completePhase(phaseId),
  });

  useEffect(() => {
    switch (status) {
      case 'success':
        console.log(data);
        onCompleted(data!);
        toast.success(`Phase ${phase.title} completed!`);
        break;

      case 'error':
        toast.error(`Failed to complete the phase: ${error!.message}`);
        break;

      case 'idle':
      case 'pending':
        break;

      default:
        notReachable(status);
    }
  }, [status]);

  if (variant === 'button') {
    return (
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          mutate(phase.id);
        }}
        loading={status === 'pending'}
        size={'sm'}
      >
        Complete
      </Button>
    );
  }

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutate(phase.id);
      }}
      disabled={status === 'pending'}
    >
      {status === 'pending' && <Spinner />}
      Complete
    </DropdownMenuItem>
  );
};
