import { MilestoneEntity } from '@/modules/milestones/types/entity';
import { TaskCard } from '@/modules/tasks/components/TaskCard';
import { TasksBuilder } from '@/modules/tasks/components/TasksBuilder';
import { TasksLoader } from '@/modules/tasks/components/TasksLoader';

export const TasksBlock = ({ milestone }: { milestone: MilestoneEntity }) => {
  return (
    <TasksLoader milestoneId={milestone.id}>
      {(tasks, setData) => {
        if (tasks.length === 0) {
          return <TasksBuilder milestone={milestone} onDone={setData} />;
        }

        return (
          <div className={'flex flex-col gap-2'}>
            <div className={'text-xl font-semibold'}>Tasks</div>

            <div className={'flex flex-col gap-4'}>
              <div className={'flex flex-wrap gap-2'}>
                {tasks.map((task) => (
                  <TaskCard task={task} key={task.id} />
                ))}
              </div>
            </div>
          </div>
        );
      }}
    </TasksLoader>
  );
};
