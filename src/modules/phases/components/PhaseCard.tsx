import { useEffect, useState } from 'react';

import { Loader2Icon } from 'lucide-react';

import { createMilestones } from '@/modules/milestones/api/createMilestones';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';

export type Msg = { type: 'onPhaseUpdated' } | { type: 'onOpenClicked' };

export const PhaseCard = ({
  phase,
  index,
  onMsg,
}: {
  phase: PhaseEntity;
  index: number;
  onMsg: (msg: Msg) => void;
}) => {
  const [currentPhase, setCurrentPhase] = useState<PhaseEntity>(phase);
  return (
    <div key={currentPhase.id} className={'rounded border p-2'}>
      <div className={'text-lg font-semibold'}>
        {index}. {currentPhase.title}
      </div>
      <div className={'text-muted-foreground'}>{currentPhase.description}</div>
      <div className={'text-sm'}>
        Estimation: {currentPhase.minDaysNeeded} - {currentPhase.maxDaysNeeded}{' '}
        days
      </div>
      <div className={'text-sm'}>
        Expertise needed: {currentPhase.expertiseNeeded}
      </div>

      {currentPhase.status === 'building' && (
        <MilestonesBuilder
          phase={currentPhase}
          onDone={(phase) => setCurrentPhase(phase)}
        />
      )}

      {currentPhase.status !== 'building' && (
        <Button
          className={'mt-2'}
          size={'sm'}
          onClick={() => onMsg({ type: 'onOpenClicked' })}
        >
          Review
        </Button>
      )}
    </div>
  );
};

const MilestonesBuilder = ({
  phase,
  onDone,
}: {
  phase: PhaseEntity;
  onDone: (phase: PhaseEntity) => void;
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
        <Badge className="mt-2 flex items-center gap-2 bg-yellow-100 text-yellow-800">
          <Loader2Icon className="animate-spin" />
          Milestones development in the progress...
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
            Error occurred during milestones creation: {state.error.message}
          </Badge>
          <Button onClick={reload}>Try again</Button>
        </div>
      );

    default:
      return notReachable(state);
  }
};
