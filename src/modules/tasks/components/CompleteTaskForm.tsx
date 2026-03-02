import { useEffect, useRef, useState } from 'react';

import type { AxiosError } from 'axios';
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
import { useMutation } from '@tanstack/react-query';

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
        onUpdate={(newTask) => {
          onUpdate({ ...newTask, milestone: task.milestone });
          setOpen(false);
        }}
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
  const { mutate, status, data, error } = useMutation<
    TaskEntity,
    AxiosError<{ message: string }>,
    { taskId: string; message: string }
  >({
    mutationFn: (params) => completeTask(params),
  });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(
          `Failed to submit: ${error!.response?.data.message || error!.message}`,
        );
        break;

      case 'success':
        setMessage('');
        onUpdate(data!);
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

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
          disabled={status === 'pending'}
          ref={textAreaRef}
          className={'w-full'}
        />
        <Button
          className={'w-full'}
          onClick={() => mutate({ taskId: task.id, message })}
          loading={status === 'pending'}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
