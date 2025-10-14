import { useEffect } from 'react';

import { toast } from 'sonner';

import { startPhase } from '@/modules/phases/api/startPhase';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button';
import { DropdownMenuItem } from '@/ui/dropdown-menu';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const StartPhaseForm = ({
  phase,
  onStarted,
  variant,
}: {
  phase: PhaseEntity;
  onStarted: (phase: PhaseEntity) => void;
  variant: 'menuItem' | 'button';
}) => {
  const { state, load } = useLazyLoadableData(startPhase);

  useEffect(() => {
    switch (state.type) {
      case 'loaded':
        onStarted(state.data);
        toast.success(`Phase ${phase.title} started successfully!`);
        break;

      case 'error':
        toast.error(`Failed to start the phase: ${state.error.message}`);
        break;

      case 'not_requested':
      case 'loading':
        break;

      default:
        notReachable(state);
    }
  }, [state]);

  if (variant === 'button') {
    return (
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          load(phase.id);
        }}
        loading={state.type === 'loading'}
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
        load(phase.id);
      }}
      disabled={state.type === 'loading'}
    >
      {state.type === 'loading' && <Spinner />}
      Start
    </DropdownMenuItem>
  );
};
