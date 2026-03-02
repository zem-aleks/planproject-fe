import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { useLazyMutation } from '@/lib/adapters';
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
  const { load, state } = useLazyMutation({ mutationFn: completeMilestone });
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
          disabled={state.type === 'loading'}
          ref={textAreaRef}
          className={'w-full'}
        />
        <Button
          className={'w-full'}
          onClick={() => load({ milestoneId: milestone.id, message })}
          loading={state.type === 'loading'}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
