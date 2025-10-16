import { useEffect, useRef, useState } from 'react';

import { toast } from 'sonner';

import { modifyPhases } from '@/modules/phases/api/modifyPhases';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';
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

export const ModifyPhasesForm = ({
  project,
  onModified,
}: {
  project: ProjectEntity;
  onModified: (phases: PhaseEntity[]) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  if (project.status !== 'analyzing') {
    return null;
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
      <Button
        variant={'outline'}
        className={'w-full'}
        onClick={() => setOpen(true)}
      >
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
  project: ProjectEntity;
  open: boolean;
  onClose: () => void;
  onUpdate: (phases: PhaseEntity[]) => void;
}) => {
  const { load, state } = useLazyLoadableData(modifyPhases);
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
          <DialogTitle className={'text-xl'}>Modify Phases</DialogTitle>
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
          disabled={state.type === 'loading'}
          ref={textAreaRef}
          className={'w-full'}
        />
        <Button
          className={'w-full'}
          onClick={() => load({ projectId: project.id, message })}
          loading={state.type === 'loading'}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
