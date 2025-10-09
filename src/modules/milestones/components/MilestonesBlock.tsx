import { MilestoneCard } from '@/modules/milestones/components/MilestoneCard';
import { MilestonesLoader } from '@/modules/milestones/components/MilestonesLoader';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import { noOperation } from '@/utils/notReachable';

export const MilestonesBlock = ({
  project,
  phase,
}: {
  project: ProjectEntity;
  phase: PhaseEntity;
}) => {
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex items-center justify-between'}>
        <h2 className={'text-xl font-semibold'}>Milestones</h2>
        {project.status === 'analyzing' && (
          <Button variant={'outline'} onClick={() => alert('Coming soon')}>
            Modify Milestones
          </Button>
        )}
      </div>
      <MilestonesLoader phaseId={phase.id}>
        {(milestones) => (
          <div className={'grid gap-4 lg:grid-cols-2'}>
            {milestones.map((milestone) => (
              <MilestoneCard
                phase={phase}
                milestone={milestone}
                key={phase.id}
                onUpdated={noOperation}
              />
            ))}
          </div>
        )}
      </MilestonesLoader>
    </div>
  );
};
