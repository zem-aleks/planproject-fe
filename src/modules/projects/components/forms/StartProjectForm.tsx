import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { startProject } from '@/modules/projects/api/startProject';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const StartProjectForm = ({
  project,
  onStarted,
}: {
  project: ProjectEntity;
  onStarted: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <StartProjectModal
        open={open}
        onClose={() => setOpen(false)}
        project={project}
        onStarted={() => {
          onStarted();
          setOpen(false);
        }}
      />
      <Button className={'w-full'} onClick={() => setOpen(true)}>
        Start Project
      </Button>
    </>
  );
};

const StartProjectModal = ({
  open,
  project,
  onStarted,
  onClose,
}: {
  open: boolean;
  project: ProjectEntity;
  onStarted: () => void;
  onClose: () => void;
}) => {
  const { state, load } = useLazyLoadableData(startProject);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(
          `Failed to start the project: ${state.error.response?.data.message || state.error.message}`,
        );
        break;

      case 'loaded':
        onStarted();
        toast.success(`Project started successfully!`);
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  if (project.status !== 'analyzing') {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      modal={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={'text-xl'}>
            Start <span className={''}>{project.title}</span>
          </DialogTitle>
          <DialogDescription className={'text-muted-foreground w-full'}>
            Once you start the project, the first phase will be activated and
            daily tasks will be generated. It also activates the timeline
            tracking.
          </DialogDescription>
        </DialogHeader>

        <Button
          className={'w-full'}
          loading={state.type === 'loading'}
          onClick={() => load(project.id)}
        >
          Let's go!
        </Button>
        {state.type === 'loading' && (
          <div className={'text-center text-sm text-orange-400'}>
            This may take some time. Tasks generation is in progress...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
