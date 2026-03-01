import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectProgressCard } from '@/modules/projects/components/ProjectProgressCard';
import { StartProjectForm } from '@/modules/projects/components/forms/StartProjectForm';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { BrainstormForm } from '@/modules/soul/components/BrainstormForm';
import { notReachable } from '@/utils/notReachable';

export type Msg =
  | { type: 'onProjectStarted' }
  | { type: 'onPhasesChanged'; phases: PhaseEntity[] }
  | { type: 'onSoulChanged' };

export const ProjectActions = ({
  project,
  onMsg,
}: {
  project: ProjectPreviewEntity;
  onMsg: (msg: Msg) => void;
}) => {
  switch (project.status) {
    case 'draft':
    case 'shaping':
    case 'completed':
    case 'onHold':
    case 'cancelled':
    case 'soulBuilding':
    case 'soulError':
      return null;

    case 'active':
      return (
        <>
          <BrainstormForm
            project={project}
            onSoulChanged={() => onMsg({ type: 'onSoulChanged' })}
          />
          <ProjectProgressCard project={project} />
        </>
      );

    case 'soulDone':
    case 'analyzing':
      return (
        <div className="grid grid-cols-1 gap-4">
          <BrainstormForm
            project={project}
            onSoulChanged={() => onMsg({ type: 'onSoulChanged' })}
          />
          <StartProjectForm
            project={project}
            onStarted={() => onMsg({ type: 'onProjectStarted' })}
          />

          {/*<div className={'relative flex w-40 items-center justify-center'}>*/}
          {/*  <div className={'absolute w-full border-b'} />*/}
          {/*  <div*/}
          {/*    className={*/}
          {/*      'text-muted-foreground relative rounded bg-white px-2 text-sm'*/}
          {/*    }*/}
          {/*  >*/}
          {/*    or*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      );

    default:
      return notReachable(project.status);
  }
};
