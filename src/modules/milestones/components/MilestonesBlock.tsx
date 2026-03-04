import { AlertCircleIcon, Loader2Icon } from 'lucide-react';

import { MilestoneCard } from '@/modules/milestones/components/MilestoneCard';
import { MilestonesLoader } from '@/modules/milestones/components/MilestonesLoader';
import { ModifyMilestonesForm } from '@/modules/milestones/components/ModifyMilestonesForm';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { Card } from '@/ui/card';

export const MilestonesBlock = ({ phase }: { phase: PhaseEntity }) => {
  if (phase.status === 'building') {
    return (
      <div className={'flex flex-col gap-2'}>
        <h2 className={'text-xl font-semibold text-white'}>Milestones</h2>
        <Card className="flex items-center gap-2 p-4 text-sm text-orange-500">
          <Loader2Icon className="size-4 animate-spin" />
          Generating milestones...
        </Card>
      </div>
    );
  }

  if (phase.status === 'error') {
    return (
      <div className={'flex flex-col gap-2'}>
        <h2 className={'text-xl font-semibold text-white'}>Milestones</h2>
        <Card className="flex items-center gap-2 p-4 text-sm text-red-500">
          <AlertCircleIcon className="size-4 shrink-0" />
          Milestones generation failed. Please try again later.
        </Card>
      </div>
    );
  }

  return (
    <MilestonesLoader phaseId={phase.id}>
      {(milestones, reload) => (
        <div className={'flex flex-col gap-2'}>
          <div className={'flex items-center justify-between'}>
            <h2 className={'text-xl font-semibold text-white'}>Milestones</h2>
            <ModifyMilestonesForm phase={phase} onModified={reload} />
          </div>

          <div className={'grid gap-4 lg:grid-cols-2'}>
            {milestones.map((milestone) => (
              <MilestoneCard
                phase={phase}
                milestone={milestone}
                key={phase.id}
                onUpdated={reload}
              />
            ))}
          </div>
        </div>
      )}
    </MilestonesLoader>
  );
};
