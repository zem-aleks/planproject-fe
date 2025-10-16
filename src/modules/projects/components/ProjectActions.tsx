import { PhaseEntity } from '@/modules/phases/types/entity';
import { ModifyPhasesForm } from '@/modules/projects/components/forms/ModifyPhasesForm';
import { StartProjectForm } from '@/modules/projects/components/forms/StartProjectForm';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { notReachable } from '@/utils/notReachable';

export type Msg =
  | { type: 'onProjectStarted' }
  | { type: 'onPhasesChanged'; phases: PhaseEntity[] };

export const ProjectActions = ({
  project,
  onMsg,
}: {
  project: ProjectEntity;
  onMsg: (msg: Msg) => void;
}) => {
  switch (project.status) {
    case 'draft':
    case 'shaping':
    case 'active':
    case 'completed':
    case 'onHold':
    case 'cancelled':
      return null;

    case 'analyzing':
      return (
        <div className={'flex flex-col items-center gap-2'}>
          <StartProjectForm
            project={project}
            onStarted={() => onMsg({ type: 'onProjectStarted' })}
          />

          <div className={'relative flex w-40 items-center justify-center'}>
            <div className={'absolute w-full border-b'} />
            <div
              className={'text-muted-foreground relative bg-white px-2 text-sm'}
            >
              or
            </div>
          </div>

          <ModifyPhasesForm
            project={project}
            onModified={(phases) => onMsg({ type: 'onPhasesChanged', phases })}
          />
        </div>
      );

    default:
      return notReachable(project.status);
  }
};
