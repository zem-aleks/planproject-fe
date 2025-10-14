import { Link } from 'react-router';

import { MilestonesList } from '@/modules/milestones/components/MilestonesList';
import { CompletePhaseForm } from '@/modules/phases/components/CompletePhaseForm';
import { PhaseDescription } from '@/modules/phases/components/PhaseDescription';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { StartPhaseForm } from '@/modules/phases/components/StartPhaseForm';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { Button } from '@/ui/button';
import { DaysCounter } from '@/ui/custom/DaysCounter';

export const RoadmapPage = () => {
  const { project } = useProjectByUrlParam();
  if (!project || project.status === 'draft') {
    return <ProjectNotFound />;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [
          { title: 'Projects', href: '/projects' },
          { title: `${project.title}`, href: `/project/${project.id}` },
        ],
        title: `Roadmap`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className={'flex flex-row gap-8'}>
          <div className="flex grow flex-col gap-1">
            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold'
              }
            >
              Roadmap
            </h1>
          </div>
        </div>

        <PhasesLoader projectId={project.id}>
          {(phases, _, setPhases) => (
            <div className={'flex flex-col'}>
              <Accordion type="multiple">
                {phases.map((phase, index) => (
                  <AccordionItem value={phase.id}>
                    <AccordionTrigger>
                      <div className={'flex items-center gap-2 text-xl'}>
                        {index + 1}. {phase.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className={'flex flex-col gap-2'}>
                      <div className={'mb-6'}>
                        <div className={'flex gap-4'}>
                          <PhaseDescription phase={phase} />

                          {phase.status === 'inProgress' && (
                            <DaysCounter
                              startedAt={phase.startedAt}
                              daysCount={phase.maxDaysNeeded}
                            />
                          )}
                        </div>
                        Actions
                        <div className={'mt-2 flex items-center gap-2'}>
                          <Button size={'sm'} asChild>
                            <Link
                              to={`/project/${project.id}/phase/${phase.id}`}
                            >
                              View Phase Details
                            </Link>
                          </Button>
                          {phase.status === 'inProgress' && (
                            <CompletePhaseForm
                              variant={'button'}
                              phase={phase}
                              onCompleted={(newPhase) => {
                                setPhases(
                                  phases.map((p) =>
                                    p.id === newPhase.id
                                      ? {
                                          ...newPhase,
                                          milestones: phase.milestones,
                                        }
                                      : p,
                                  ),
                                );
                              }}
                            />
                          )}
                          {phase.status === 'notStarted' && (
                            <StartPhaseForm
                              variant={'button'}
                              phase={phase}
                              onStarted={(newPhase) => {
                                setPhases(
                                  phases.map((p) =>
                                    p.id === newPhase.id
                                      ? {
                                          ...newPhase,
                                          milestones: phase.milestones,
                                        }
                                      : p,
                                  ),
                                );
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <MilestonesList phase={phase} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </PhasesLoader>
      </div>
    </PageTemplate>
  );
};
