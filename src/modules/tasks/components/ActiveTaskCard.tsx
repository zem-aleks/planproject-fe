import { CompleteTaskForm } from '@/modules/tasks/components/CompleteTaskForm';
import { TaskDetailsEntity } from '@/modules/tasks/types/entity';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';

export type Msg = { type: 'onTaskUpdated'; task: TaskDetailsEntity };

export const ActiveTaskCard = ({
  task,
  onMsg,
}: {
  task: TaskDetailsEntity;
  onMsg: (msg: Msg) => void;
}) => {
  return (
    <Card key={task.id} className={'w-full gap-2 p-4'}>
      <div
        className={
          'mb-2 flex h-10 min-w-[128px] shrink-0 items-center gap-3 self-start rounded-lg border p-0 px-4 shadow'
        }
      >
        <div className={'my-2'}>{task.milestone.title}</div>
        <div className={'bg-border h-full w-[1px]'} />
        <div className={'my-2'}>Day {task.day}</div>
      </div>
      <div className={'text-lg font-semibold'}>{task.title}</div>
      <div>
        <div className={'font-semibold'}>Description:</div>
        <MarkdownFormat>{task.description}</MarkdownFormat>
      </div>
      <div>
        <div className={'font-semibold'}>Examples:</div>
        <MarkdownFormat>{task.examples}</MarkdownFormat>
      </div>
      <div>
        <div className={'font-semibold'}>Useful resources:</div>
        <MarkdownFormat>{task.usefulResources}</MarkdownFormat>
      </div>
      <div>
        <div className={'font-semibold'}>Definition of done:</div>
        <MarkdownFormat>{task.definitionOfDone}</MarkdownFormat>
      </div>

      {task.status !== 'completed' && (
        <CompleteTaskForm
          task={task}
          onUpdate={(newTask) =>
            onMsg({ type: 'onTaskUpdated', task: newTask })
          }
        />
      )}

      {task.status === 'completed' && (
        <div className={'flex flex-col gap-2'}>
          <Badge variant={'success'}>Completed</Badge>
          {task.completeMessage && (
            <div
              className={
                'text-muted-foreground bg-secondary rounded-lg p-2 px-4'
              }
            >
              <b>Comment:</b> {task.completeMessage}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
