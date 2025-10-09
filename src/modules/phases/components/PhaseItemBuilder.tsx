import { useState } from 'react';
import { Link } from 'react-router';

import { MilestonesBuilder } from '@/modules/milestones/components/MilestonesBuilder';
import { PhaseEntityWithMilestones } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { notReachable } from '@/utils/notReachable';
import { IconDotsVertical } from '@tabler/icons-react';

export const PhaseItemBuilder = ({
  phase,
  project,
  index,
}: {
  phase: PhaseEntityWithMilestones;
  project: ProjectEntity;
  index: number;
}) => {
  const [currentPhase, setCurrentPhase] =
    useState<PhaseEntityWithMilestones>(phase);

  switch (currentPhase.status) {
    case 'building':
      return (
        <div className={'flex items-center justify-between'}>
          <div>
            {index + 1}. {currentPhase.title}
          </div>
          <MilestonesBuilder
            phase={currentPhase}
            onDone={(phase) => setCurrentPhase(phase)}
          />
        </div>
      );

    case 'inProgress':
      return (
        <div className={'flex items-center justify-between'}>
          <Link to={`/project/${project.id}/phase/${currentPhase.id}`}>
            <Button variant={'link'} className={'px-0'}>
              {index + 1}. {currentPhase.title}
            </Button>
          </Link>

          <div className="flex flex-row items-center gap-2">
            <Badge className={'bg-orange-400 text-white'}>In progress</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/project/${project.id}/phase/${currentPhase.id}`}>
                    Open
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Pause</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Complete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );

    case 'completed':
      return (
        <div className={'flex items-center justify-between'}>
          <Link to={`/project/${project.id}/phase/${currentPhase.id}`}>
            <Button variant={'link'} className={'px-0'}>
              {index + 1}. {currentPhase.title}
            </Button>
          </Link>

          <Badge className={'bg-green-600 text-white'}>Completed</Badge>
        </div>
      );

    case 'notStarted':
      return (
        <div className={'flex items-center justify-between'}>
          <Link to={`/project/${project.id}/phase/${currentPhase.id}`}>
            <Button variant={'link'} className={'px-0'}>
              {index + 1}. {currentPhase.title}
            </Button>
          </Link>

          <div className="flex flex-row items-center gap-2">
            <Badge className={''}>Not started</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/project/${project.id}/phase/${currentPhase.id}`}>
                    Open
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Start</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );

    default:
      return notReachable(currentPhase.status);
  }
};
