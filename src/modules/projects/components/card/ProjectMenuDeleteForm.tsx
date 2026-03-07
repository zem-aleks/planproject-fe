import { useEffect } from 'react';

import { LoaderCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { deleteProject } from '@/modules/projects/api/deleteProject.ts';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { DropdownMenuItem } from '@/ui/dropdown-menu.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useMutation } from '@tanstack/react-query';

export type Msg = {
  type: 'onProjectDeleted';
  project: ProjectPreviewEntity;
};

type Props = {
  project: ProjectPreviewEntity;
  onMsg: (msg: Msg) => void;
};

export const ProjectMenuDeleteForm = ({ project, onMsg }: Props) => {
  const { status, error, mutate } = useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
  });

  useEffect(() => {
    switch (status) {
      case 'success':
        onMsg({ type: 'onProjectDeleted', project });
        toast.success(`Project ${project.title} deleted successfully!`);
        break;

      case 'error':
        toast.error(`Failed to delete project: ${error!.message}`);
        break;

      case 'idle':
      case 'pending':
        // No action needed
        break;

      default:
        notReachable(status);
    }
  }, [status]);

  switch (status) {
    case 'error':
    case 'idle':
    case 'success':
      return (
        <DropdownMenuItem
          className={'text-destructive'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mutate(project.id);
          }}
        >
          <Trash2 className={'text-destructive'} />
          Delete
        </DropdownMenuItem>
      );

    case 'pending':
      return (
        <DropdownMenuItem className={'text-destructive'}>
          <LoaderCircle className={'animate-spin'} />
          Deleting...
        </DropdownMenuItem>
      );

    default:
      return notReachable(status);
  }
};
