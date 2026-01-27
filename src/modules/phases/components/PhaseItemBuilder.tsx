import { Link } from 'react-router';

import { Loader2Icon } from 'lucide-react';

import { CompletePhaseForm } from '@/modules/phases/components/CompletePhaseForm';
import { PhaseStatusBadge } from '@/modules/phases/components/PhaseStatus';
import { StartPhaseForm } from '@/modules/phases/components/StartPhaseForm';
import { PhaseEntityWithMilestones } from '@/modules/phases/types/entity';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
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
  onChange,
}: {
  phase: PhaseEntityWithMilestones;
  project: ProjectPreviewEntity;
  index: number;
  onChange: () => void;
}) => {
  switch (phase.status) {
    case 'building':
      return (
        <div
          className={
            'flex flex-col justify-between sm:flex-row sm:items-center sm:gap-2'
          }
        >
          <div className={'text-sm font-medium'}>
            {index + 1}. {phase.title}
          </div>
          <Loader2Icon className="animate-spin" />
        </div>
      );

    case 'inProgress':
      return (
        <div
          className={
            'flex flex-col justify-between sm:flex-row sm:items-center sm:gap-2'
          }
        >
          <Link to={`/project/${project.id}/phase/${phase.id}`}>
            <Button variant={'link'} className={'px-0'}>
              {index + 1}. {phase.title}
            </Button>
          </Link>

          <div className="flex flex-row items-center gap-2">
            <Badge variant={'warning'}>In progress</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/project/${project.id}/phase/${phase.id}`}>
                    Preview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <CompletePhaseForm
                  phase={phase}
                  onCompleted={
                    () => onChange()
                    // setCurrentPhase({
                    //   ...newPhase,
                    //   milestones: phase.milestones,
                    // })
                  }
                  variant={'menuItem'}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );

    case 'error':
    case 'completed':
      return (
        <div
          className={
            'flex flex-col justify-between sm:flex-row sm:items-center sm:gap-2'
          }
        >
          <Link to={`/project/${project.id}/phase/${phase.id}`}>
            <Button variant={'link'} className={'px-0'}>
              {index + 1}. {phase.title}
            </Button>
          </Link>

          <PhaseStatusBadge status={phase.status} />
        </div>
      );

    case 'notStarted':
      return (
        <div
          className={
            'flex flex-col justify-between sm:flex-row sm:items-center sm:gap-2'
          }
        >
          <Link to={`/project/${project.id}/phase/${phase.id}`}>
            <Button variant={'link'} className={'px-0'}>
              {index + 1}. {phase.title}
            </Button>
          </Link>

          <div className="flex flex-row items-center gap-2">
            <PhaseStatusBadge status={phase.status} />
            {project.status === 'active' && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <IconDotsVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/project/${project.id}/phase/${phase.id}`}>
                      Preview
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <StartPhaseForm
                    variant={'menuItem'}
                    phase={phase}
                    onStarted={
                      () => onChange()
                      // setCurrentPhase({
                      //   ...newPhase,
                      //   milestones: phase.milestones,
                      // });
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      );

    default:
      return notReachable(phase.status);
  }
};
