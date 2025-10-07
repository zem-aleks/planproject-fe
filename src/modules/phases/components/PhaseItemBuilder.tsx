import { useState } from 'react';
import { Link } from 'react-router';

import { MilestonesBuilder } from '@/modules/milestones/components/MilestonesBuilder';
import { PhaseEntityWithMilestones } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { notReachable } from '@/utils/notReachable';

export const PhaseItemBuilder = ({
  phase,
  project,
  index,
}: {
  phase: PhaseEntityWithMilestones;
  project: ProjectEntity;
  index: number;
}) => {
  const [currentPhase, setCurrentPhase] =
    useState<PhaseEntityWithMilestones>(phase);

  switch (currentPhase.status) {
    case 'building':
      return (
        <div className={'flex items-center justify-between'}>
          <div>
            {index + 1}. {currentPhase.title}
          </div>
          <MilestonesBuilder
            phase={currentPhase}
            onDone={(phase) => setCurrentPhase(phase)}
          />
        </div>
      );

    case 'inProgress':
    case 'completed':
    case 'notStarted':
      return (
        <div className={'flex items-center justify-between'}>
          <Link to={`/project/${project.id}/phase/${currentPhase.id}`}>
            <Button variant={'link'} className={'px-0'}>
              {index + 1}. {currentPhase.title}
            </Button>
          </Link>

          <Badge>{currentPhase.milestones.length} milestones</Badge>
        </div>
      );

    default:
      return notReachable(currentPhase.status);
  }
};
