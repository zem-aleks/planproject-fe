import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectProgressCard } from '@/modules/projects/components/ProjectProgressCard';
import { BuildPlanForm } from '@/modules/projects/components/forms/BuildPlanForm';
import { StartProjectForm } from '@/modules/projects/components/forms/StartProjectForm';
import type { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { SoulActionButtons } from '@/modules/soul/components/SoulActionButtons';
import { notReachable } from '@/utils/notReachable';

export type Msg =
  | { type: 'onProjectStarted' }
  | { type: 'onPlanBuilt' }
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
          <SoulActionButtons
            project={project}
            onSoulChanged={() => onMsg({ type: 'onSoulChanged' })}
          />
          <BuildPlanForm
            project={project}
            onPlanBuilt={() => onMsg({ type: 'onPlanBuilt' })}
          />
          <ProjectProgressCard project={project} />
        </>
      );

    case 'planning':
    case 'soulDone':
    case 'planningError':
      return (
        <div className="grid grid-cols-1 gap-4">
          <SoulActionButtons
            project={project}
            onSoulChanged={() => onMsg({ type: 'onSoulChanged' })}
          />
          <BuildPlanForm
            project={project}
            onPlanBuilt={() => onMsg({ type: 'onPlanBuilt' })}
          />
        </div>
      );

    case 'analyzing':
      return (
        <div className="grid grid-cols-1 gap-4">
          <SoulActionButtons
            project={project}
            onSoulChanged={() => onMsg({ type: 'onSoulChanged' })}
          />
          <StartProjectForm
            project={project}
            onStarted={() => onMsg({ type: 'onProjectStarted' })}
          />
          <BuildPlanForm
            project={project}
            onPlanBuilt={() => onMsg({ type: 'onPlanBuilt' })}
          />
        </div>
      );

    default:
      return notReachable(project.status);
  }
};
