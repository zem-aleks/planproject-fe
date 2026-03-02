import { useReloadableQuery } from '@/lib/adapters';
import { queryKeys } from '@/lib/queryKeys';
import type { ReloadableData } from '@/lib/types';
import { MilestoneCard } from '@/modules/milestones/components/MilestoneCard';
import { MilestonesLoader } from '@/modules/milestones/components/MilestonesLoader';
import { PhaseDescription } from '@/modules/phases/components/PhaseDescription';
import { PhaseEntityWithMilestones } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { getActiveTasks } from '@/modules/tasks/api/getActiveTasks';
import { TaskDetailsEntity } from '@/modules/tasks/types/entity';
import { Button } from '@/ui/button';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { notReachable } from '@/utils/notReachable';

export const ActivePhases = ({
  phases,
  project,
}: {
  phases: PhaseEntityWithMilestones[];
  project: ProjectEntity;
}) => {
  const { state, reload } = useReloadableQuery<TaskDetailsEntity[]>({
    queryKey: queryKeys.tasks.active(project.id),
    queryFn: ({ signal }) => getActiveTasks(project.id, { signal }),
  });
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
                        onUpdated={reload}
                      />
                    ))}
                  </div>
                )}
              </MilestonesLoader>
            </div>

            <div className={'flex flex-col gap-2'}>
              <h2 className={'text-xl font-semibold'}>Ongoing Tasks</h2>
              <OngoingTasksBlock
                state={state}
                onMsg={(msg) => {
                  switch (msg.type) {
                    case 'onTryAgain':
                      reload();
                      break;

                    default:
                      return notReachable(msg.type);
                  }
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

type Msg = { type: 'onTryAgain' };

const OngoingTasksBlock = ({
  state,
  onMsg,
}: {
  state: ReloadableData<TaskDetailsEntity[], void>;
  onMsg: (msg: Msg) => void;
}) => {
  switch (state.type) {
    case 'loading':
      return <div>Loading...</div>;

    case 'error':
      return (
        <div className={'flex flex-col gap-2'}>
          Failed to load tasks:{' '}
          {state.error.response?.data.message ||
            state.error.message ||
            'Unknown error'}
          <Button onClick={() => onMsg({ type: 'onTryAgain' })}>
            Try again
          </Button>
        </div>
      );

    case 'reloading':
    case 'loaded':
      if (state.data.length === 0) {
        return <div>No active tasks</div>;
      }
      return (
        <ul className={'flex flex-col gap-2'}>
          {state.data.map((task) => (
            <li key={task.id} className={'border p-2'}>
              <div className={'font-semibold'}>{task.title}</div>
              <div className={'text-muted-foreground text-sm'}>
                {task.description}
              </div>
            </li>
          ))}
        </ul>
      );
    default:
      return notReachable(state);
  }
};
