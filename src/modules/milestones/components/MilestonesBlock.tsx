import { MilestoneCard } from '@/modules/milestones/components/MilestoneCard';
import { MilestonesLoader } from '@/modules/milestones/components/MilestonesLoader';
import { ModifyMilestonesForm } from '@/modules/milestones/components/ModifyMilestonesForm';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const MilestonesBlock = ({
  // project,
  phase,
  // onModified,
}: {
  project: ProjectEntity;
  phase: PhaseEntity;
  // onModified: (phase: PhaseEntity) => void;
}) => {
  return (
    <MilestonesLoader phaseId={phase.id}>
      {(milestones, reload) => (
        <div className={'flex flex-col gap-2'}>
          <div className={'flex items-center justify-between'}>
            <h2 className={'text-xl font-semibold'}>Milestones</h2>
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
