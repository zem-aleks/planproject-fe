import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { completeTask } from '@/modules/tasks/api/completeTask';
import { TaskDetailsEntity, TaskEntity } from '@/modules/tasks/types/entity';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const CompleteTaskForm = ({
  task,
  onUpdate,
}: {
  task: TaskDetailsEntity;
  onUpdate: (task: TaskDetailsEntity) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <CompleteTaskModal
        open={open}
        onClose={() => setOpen(false)}
        task={task}
        onUpdate={(newTask) =>
          onUpdate({ ...newTask, milestone: task.milestone })
        }
      />
      <Button onClick={() => setOpen(true)}>Complete Task</Button>
    </>
  );
};

const CompleteTaskModal = ({
  open,
  task,
  onClose,
  onUpdate,
}: {
  task: TaskDetailsEntity;
  open: boolean;
  onClose: () => void;
  onUpdate: (task: TaskEntity) => void;
}) => {
  const { load, state } = useLazyLoadableData(completeTask);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(
          `Failed to submit: ${state.error.response?.data.message || state.error.message}`,
        );
        break;

      case 'loaded':
        setMessage('');
        onUpdate(state.data);
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => !open && onClose()}
      modal={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={'text-xl'}>Complete task</DialogTitle>
          <DialogDescription className={'text-muted-foreground w-full'}>
            Describe the outcome of your task. Was it done or not? What key
            learnings did you get? Did you achieve the definition of done?
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Enter your answer"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required={true}
          disabled={state.type === 'loading'}
          ref={textAreaRef}
          className={'w-full'}
        />
        <Button
          className={'w-full'}
          onClick={() => load({ taskId: task.id, message })}
          loading={state.type === 'loading'}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
