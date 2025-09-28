import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';

export const PhasesBlock = ({ project }: { project: ProjectEntity }) => {
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xl font-semibold'}>Project Phases</div>
      <PhasesLoader projectId={project.id}>
        {(phases) => <PhasesList phases={phases} />}
      </PhasesLoader>
    </div>
  );
};

const PhasesList = ({ phases }: { phases: PhaseEntity[] }) => {
  return (
    <div className={'flex flex-col gap-2'}>
      {phases.map((phase, index) => (
        <div key={phase.id} className={'rounded border p-2'}>
          <div className={'text-lg font-semibold'}>
            {index + 1}. {phase.title}
          </div>
          <div className={'text-muted-foreground'}>{phase.description}</div>
          <div className={'text-sm'}>
            Estimation: {phase.minDaysNeeded} - {phase.maxDaysNeeded} days
          </div>
          <div className={'text-sm'}>
            Expertise Needed: {phase.expertiseNeeded}
          </div>
        </div>
      ))}
    </div>
  );
};
