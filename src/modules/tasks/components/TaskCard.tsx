import { TaskEntity } from '@/modules/tasks/types/entity';
import { Card } from '@/ui/card';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';

// export type Msg = { type: 'onPhaseUpdated' } | { type: 'onOpenClicked' };

export const TaskCard = ({
  task,
  // onMsg,
}: {
  task: TaskEntity;
  // onMsg: (msg: Msg) => void;
}) => {
  return (
    <Card key={task.id} className={'w-full gap-2 p-4'}>
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
    </Card>
  );
};
