import { useEffect } from 'react';

import { LoaderCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { deleteProject } from '@/modules/projects/api/deleteProject.ts';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { DropdownMenuItem } from '@/ui/dropdown-menu.tsx';
import { notReachable } from '@/utils/notReachable.ts';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData.ts';

export type Msg = {
  type: 'onProjectDeleted';
  project: ProjectEntity;
};

type Props = {
  project: ProjectEntity;
  onMsg: (msg: Msg) => void;
};

export const ProjectMenuDeleteForm = ({ project, onMsg }: Props) => {
  const { state, load } = useLazyLoadableData(deleteProject);

  useEffect(() => {
    switch (state.type) {
      case 'loaded':
        onMsg({ type: 'onProjectDeleted', project });
        toast.success(`Project ${project.title} deleted successfully!`);
        break;

      case 'error':
        toast.error(`Failed to delete project: ${state.error.message}`);
        break;

      case 'not_requested':
      case 'loading':
        // No action needed
        break;

      default:
        notReachable(state);
    }
  }, [state]);

  switch (state.type) {
    case 'error':
    case 'not_requested':
    case 'loaded':
      return (
        <DropdownMenuItem
          className={'text-destructive'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            load(project.id);
          }}
        >
          <Trash2 className={'text-destructive'} />
          Delete
        </DropdownMenuItem>
      );

    case 'loading':
      return (
        <DropdownMenuItem className={'text-destructive'}>
          <LoaderCircle className={'animate-spin'} />
          Deleting...
        </DropdownMenuItem>
      );

    default:
      return notReachable(state);
  }
};
