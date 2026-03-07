import { useEffect } from 'react';

import { toast } from 'sonner';

import { startPhase } from '@/modules/phases/api/startPhase';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button';
import { DropdownMenuItem } from '@/ui/dropdown-menu';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useMutation } from '@tanstack/react-query';

export const StartPhaseForm = ({
  phase,
  onStarted,
  variant,
}: {
  phase: PhaseEntity;
  onStarted: (phase: PhaseEntity) => void;
  variant: 'menuItem' | 'button';
}) => {
  const { status, data, error, mutate } = useMutation({
    mutationFn: (phaseId: string) => startPhase(phaseId),
  });

  useEffect(() => {
    switch (status) {
      case 'success':
        onStarted(data!);
        toast.success(`Phase ${phase.title} started successfully!`);
        break;

      case 'error':
        toast.error(`Failed to start the phase: ${error!.message}`);
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
        Start
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
      Start
    </DropdownMenuItem>
  );
};
