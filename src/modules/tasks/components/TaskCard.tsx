import { TaskEntity } from '@/modules/tasks/types/entity';

// export type Msg = { type: 'onPhaseUpdated' } | { type: 'onOpenClicked' };

export const TaskCard = ({
  task,
  // onMsg,
}: {
  task: TaskEntity;
  // onMsg: (msg: Msg) => void;
}) => {
  return (
    <div key={task.id} className={'rounded border p-2'}>
      <div className={'text-lg font-semibold'}>{task.title}</div>
      <div className={'text-muted-foreground mb-2'}>{task.description}</div>
      <div className={'text-sm'}>
        <b>Examples:</b> {task.examples}
      </div>
      <div className={'text-sm'}>
        <b>Useful resources:</b> {task.usefulResources}
      </div>
      <div className={'text-sm'}>
        <b>Definition of done:</b> {task.definitionOfDone}
      </div>
    </div>
  );
};
