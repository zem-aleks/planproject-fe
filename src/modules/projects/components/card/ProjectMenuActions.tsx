import { Pencil, ServerCog } from 'lucide-react';

import {
  ProjectMenuDeleteForm,
  Msg as ProjectMenuDeleteFormMsg,
} from '@/modules/projects/components/card/ProjectMenuDeleteForm.tsx';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu.tsx';
import { IconDotsVertical, IconUserCircle } from '@tabler/icons-react';

export type Msg =
  | { type: 'onProjectSelect'; project: ProjectEntity }
  | { type: 'onProjectRobotConfigChange'; project: ProjectEntity }
  | { type: 'onProjectEdit'; project: ProjectEntity }
  | { type: 'onProjectCloned'; project: ProjectEntity }
  | ProjectMenuDeleteFormMsg;

type Props = {
  project: ProjectEntity;
  onMsg: (msg: Msg) => void;
};

export const ProjectMenuActions = ({ project, onMsg }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <IconDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={'bottom'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onMsg({ type: 'onProjectSelect', project });
            }}
          >
            <IconUserCircle />
            Select
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onMsg({ type: 'onProjectRobotConfigChange', project });
            }}
          >
            <ServerCog />
            Configure CA-1
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onMsg({ type: 'onProjectEdit', project });
            }}
          >
            <Pencil />
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <ProjectMenuDeleteForm project={project} onMsg={onMsg} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
