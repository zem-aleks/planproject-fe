import { useNavigate } from 'react-router';

import { PhaseCard } from '@/modules/phases/components/PhaseCard';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhasesTimeline } from '@/modules/phases/components/PhasesTimeline';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { notReachable } from '@/utils/notReachable';

export const PhasesBlock = ({ project }: { project: ProjectEntity }) => {
  const navigate = useNavigate();
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xl font-semibold'}>Project Phases</div>
      <PhasesLoader projectId={project.id}>
        {(phases, reload) => (
          <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2'}>
              {phases.map((phase, index) => (
                <PhaseCard
                  phase={phase}
                  index={index + 1}
                  key={phase.id}
                  onMsg={(msg) => {
                    switch (msg.type) {
                      case 'onPhaseUpdated':
                        reload();
                        break;

                      case 'onOpenClicked':
                        navigate(`/project/${project.id}/phase/${phase.id}`);
                        break;

                      default:
                        return notReachable(msg);
                    }
                  }}
                />
              ))}
            </div>
            <PhasesTimeline phases={phases} />
          </div>
        )}
      </PhasesLoader>
    </div>
  );
};
