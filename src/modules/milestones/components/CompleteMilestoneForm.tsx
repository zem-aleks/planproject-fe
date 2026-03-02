import { useEffect, useRef, useState } from 'react';

import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { completeMilestone } from '@/modules/milestones/api/completeMilestone';
import { MilestoneEntity } from '@/modules/milestones/types/entity';
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

export const CompleteMilestoneForm = ({
  milestone,
  onUpdate,
}: {
  milestone: MilestoneEntity;
  onUpdate: (milestone: MilestoneEntity) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <CompleteMilestoneModal
        open={open}
        onClose={() => setOpen(false)}
        milestone={milestone}
        onUpdate={(newMilestone) => {
          onUpdate(newMilestone);
          setOpen(false);
        }}
      />
      <Button onClick={() => setOpen(true)}>Complete Milestone</Button>
    </>
  );
};

const CompleteMilestoneModal = ({
  open,
  milestone,
  onClose,
  onUpdate,
}: {
  milestone: MilestoneEntity;
  open: boolean;
  onClose: () => void;
  onUpdate: (milestone: MilestoneEntity) => void;
}) => {
  const { mutate, status, data, error } = useMutation<
    MilestoneEntity,
    AxiosError<{ message: string }>,
    { milestoneId: string; message: string }
  >({
    mutationFn: (params) => completeMilestone(params),
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
          <DialogTitle className={'text-xl'}>Complete milestone</DialogTitle>
          <DialogDescription className={'text-muted-foreground w-full'}>
            Describe the outcome of your milestone. Was it done or not? What key
            learnings did you get? Did you finish all tasks?
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
          onClick={() => mutate({ milestoneId: milestone.id, message })}
          loading={status === 'pending'}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
