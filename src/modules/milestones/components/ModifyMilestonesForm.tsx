import { useEffect, useRef, useState } from 'react';

import type { AxiosError } from 'axios';
import { LockIcon, PencilIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useUser } from '@/modules/auth/contexts/UserContext';
import { modifyMilestones } from '@/modules/milestones/api/modifyMilestones';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { UpgradeSubscriptionModal } from '@/modules/subscriptions/components/UpgradeSubscriptionModal';
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
import { IconPencil } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

export const ModifyMilestonesForm = ({
  phase,
  onModified,
}: {
  phase: PhaseEntity;
  onModified: (phase: PhaseEntity) => void;
}) => {
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);

  if (phase.status !== 'notStarted') {
    return null;
  }

  if (!['pro', 'business'].includes(user?.subscription ?? '')) {
    return (
      <>
        <UpgradeSubscriptionModal open={open} onClose={() => setOpen(false)} />
        <Button onClick={() => setOpen(true)} variant={'warning'} size={'sm'}>
          <LockIcon />
          Modify Milestones
        </Button>
      </>
    );
  }

  return (
    <>
      <ModifyMilestonesModal
        open={open}
        onClose={() => setOpen(false)}
        phase={phase}
        onUpdate={(phase) => {
          onModified(phase);
          setOpen(false);
        }}
      />
      <Button variant={'warning'} onClick={() => setOpen(true)} size={'sm'}>
        <IconPencil /> Modify Milestones
      </Button>
    </>
  );
};

const ModifyMilestonesModal = ({
  open,
  phase,
  onClose,
  onUpdate,
}: {
  phase: PhaseEntity;
  open: boolean;
  onClose: () => void;
  onUpdate: (phase: PhaseEntity) => void;
}) => {
  const { mutate, status, data, error } = useMutation<
    PhaseEntity,
    AxiosError<{ message: string }>,
    { phaseId: string; message: string }
  >({
    mutationFn: (params) => modifyMilestones(params),
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
          <DialogTitle className={'text-xl'}>
            <PencilIcon className={'mb-2'} />
            Modify Milestones of "{phase.title}"
          </DialogTitle>
          <DialogDescription className={'text-muted-foreground w-full'}>
            Please describe what would you like to change? E.g., "Add a new
            milestone about X", "Remove the milestone about Y", "Change the
            description of milestone Z to ...", etc.
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
          maxLength={2000}
        />
        <Button
          className={'w-full'}
          onClick={() => mutate({ phaseId: phase.id, message })}
          loading={status === 'pending'}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
