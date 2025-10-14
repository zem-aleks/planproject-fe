import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { ActiveTaskCard } from '@/modules/tasks/components/ActiveTaskCard';
import { TasksBuilder } from '@/modules/tasks/components/TasksBuilder';
import { TasksLoader } from '@/modules/tasks/components/TasksLoader';
import { notReachable } from '@/utils/notReachable';

export const TasksBlock = ({ milestone }: { milestone: MilestoneEntity }) => {
  return (
    <TasksLoader milestoneId={milestone.id}>
      {(tasks, reload) => {
        if (tasks.length === 0) {
          return <TasksBuilder milestone={milestone} onDone={reload} />;
        }

        return (
          <div className={'flex flex-col gap-2'}>
            <div className={'text-xl font-semibold'}>Tasks</div>

            <div className={'flex flex-col gap-4'}>
              {tasks.map((task) => (
                <ActiveTaskCard
                  task={{ ...task, milestone: milestone }}
                  key={task.id}
                  onMsg={(msg) => {
                    switch (msg.type) {
                      case 'onTaskUpdated':
                        reload();
                        break;

                      default:
                        return notReachable(msg.type);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        );
      }}
    </TasksLoader>
  );
};
