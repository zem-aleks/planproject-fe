import { useEffect, useState } from 'react';

import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { startProject } from '@/modules/projects/api/startProject';
import {
  ProjectEntity,
  ProjectPreviewEntity,
} from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { notReachable } from '@/utils/notReachable';
import { IconFlag } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

export const StartProjectForm = ({
  project,
  onStarted,
}: {
  project: ProjectPreviewEntity;
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
      <Button
        className={`relative w-full animate-[glow_2s_ease_infinite] shadow shadow-white`}
        onClick={() => setOpen(true)}
      >
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
  project: ProjectPreviewEntity;
  onStarted: () => void;
  onClose: () => void;
}) => {
  const { status, error, mutate } = useMutation<
    ProjectEntity,
    AxiosError<{ message: string }>,
    string
  >({ mutationFn: (projectId) => startProject(projectId) });

  useEffect(() => {
    switch (status) {
      case 'idle':
      case 'pending':
        break;

      case 'error':
        toast.error(
          `Failed to start the project: ${error!.response?.data.message || error!.message}`,
        );
        break;

      case 'success':
        onStarted();
        toast.success(`Project started successfully!`);
        break;

      default:
        return notReachable(status);
    }
  }, [status]);

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
            <IconFlag className={'mb-2 size-8'} />
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
          loading={status === 'pending'}
          onClick={() => mutate(project.id)}
        >
          Let's go!
        </Button>
        {status === 'pending' && (
          <div className={'text-center text-sm text-orange-400'}>
            This may take some time. Tasks generation is in progress...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
