import { useState } from 'react';

import { MilestonesBuilder } from '@/modules/milestones/components/MilestonesBuilder';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Button } from '@/ui/button';

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
