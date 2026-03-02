import { useEffect, useRef, useState } from 'react';

import type { AxiosError } from 'axios';
import { LockIcon, PencilIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useUser } from '@/modules/auth/contexts/UserContext';
import { modifyPhases } from '@/modules/phases/api/modifyPhases';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
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
import { useMutation } from '@tanstack/react-query';

export const ModifyPhasesForm = ({
  project,
  onModified,
}: {
  project: ProjectPreviewEntity;
  onModified: (phases: PhaseEntity[]) => void;
}) => {
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const isActive =
    project.status === 'analyzing' || project.status === 'active';

  if (!isActive) {
    return null;
  }

  if (!['pro', 'business'].includes(user?.subscription ?? '')) {
    return (
      <>
        <UpgradeSubscriptionModal open={open} onClose={() => setOpen(false)} />
        <Button onClick={() => setOpen(true)} variant={'warning'} size={'sm'}>
          <LockIcon />
          Modify Phases
        </Button>
      </>
    );
  }

  return (
    <>
      <ModifyPhasesModal
        open={open}
        onClose={() => setOpen(false)}
        project={project}
        onUpdate={(phases) => {
          onModified(phases);
          setOpen(false);
        }}
      />
      <Button onClick={() => setOpen(true)} variant={'warning'} size={'sm'}>
        <PencilIcon />
        Modify Phases
      </Button>
    </>
  );
};

const ModifyPhasesModal = ({
  open,
  project,
  onClose,
  onUpdate,
}: {
  project: ProjectPreviewEntity;
  open: boolean;
  onClose: () => void;
  onUpdate: (phases: PhaseEntity[]) => void;
}) => {
  const { mutate, status, data, error } = useMutation<
    PhaseEntity[],
    AxiosError<{ message: string }>,
    { projectId: string; message: string }
  >({ mutationFn: (params) => modifyPhases(params) });
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
            Modify Phases
          </DialogTitle>
          <DialogDescription className={'text-muted-foreground w-full'}>
            Please describe what would you like to change? E.g., "Add a new
            phase for user testing", "Remove the deployment phase", "Change the
            duration of the design phase to 3 weeks", etc. Our AI will analyze
            your request and suggest modifications to the project phases. You
            can then review and adjust these suggestions as needed.
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
          onClick={() => mutate({ projectId: project.id, message })}
          loading={status === 'pending'}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
