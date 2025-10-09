import { MilestoneCard } from '@/modules/milestones/components/MilestoneCard';
import { MilestonesLoader } from '@/modules/milestones/components/MilestonesLoader';
import { PhaseDescription } from '@/modules/phases/components/PhaseDescription';
import { PhaseEntityWithMilestones } from '@/modules/phases/types/entity';
import { DaysCounter } from '@/ui/custom/DaysCounter';

export const ActivePhases = ({
  phases,
}: {
  phases: PhaseEntityWithMilestones[];
}) => {
  const activePhases = phases.filter((phase) => phase.status === 'inProgress');
  if (activePhases.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <h2 className={'text-xl font-semibold'}>Active Phases</h2>
        <div className={'text-muted-foreground'}>
          Activate a phase to see its details here.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <h2 className={'text-2xl font-semibold'}>Active Phases</h2>
      <ul className={'flex flex-col gap-1'}>
        {activePhases.map((phase) => (
          <li key={phase.id} className={'flex flex-col gap-8'}>
            <div className={'flex gap-4'}>
              <div>
                <div className={'text-xl font-semibold'}>{phase.title}</div>
                <PhaseDescription phase={phase} />
              </div>

              <DaysCounter
                startedAt={phase.startedAt}
                daysCount={phase.maxDaysNeeded}
              />
            </div>

            <div className={'flex flex-col gap-2'}>
              <h2 className={'text-xl font-semibold'}>Current Milestones</h2>
              <MilestonesLoader phaseId={phase.id}>
                {(milestones) => (
                  <div className={'grid gap-4 lg:grid-cols-2'}>
                    {milestones.map((milestone) => (
                      <MilestoneCard
                        phase={phase}
                        milestone={milestone}
                        key={milestone.id}
                      />
                    ))}
                  </div>
                )}
              </MilestonesLoader>
            </div>

            <div className={'flex flex-col gap-2'}>
              <h2 className={'text-xl font-semibold'}>Ongoing Tasks</h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
