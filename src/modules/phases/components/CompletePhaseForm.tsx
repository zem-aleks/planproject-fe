import { useEffect } from 'react';

import { toast } from 'sonner';

import { completePhase } from '@/modules/phases/api/completePhase';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button';
import { DropdownMenuItem } from '@/ui/dropdown-menu';
import { Spinner } from '@/ui/spinner';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const CompletePhaseForm = ({
  phase,
  onCompleted,
  variant,
}: {
  phase: PhaseEntity;
  onCompleted: (phase: PhaseEntity) => void;
  variant: 'menuItem' | 'button';
}) => {
  const { state, load } = useLazyLoadableData(completePhase);

  useEffect(() => {
    switch (state.type) {
      case 'loaded':
        console.log(state.data);
        onCompleted(state.data);
        toast.success(`Phase ${phase.title} completed!`);
        break;

      case 'error':
        toast.error(`Failed to complete the phase: ${state.error.message}`);
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
        Complete
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
      Complete
    </DropdownMenuItem>
  );
};
