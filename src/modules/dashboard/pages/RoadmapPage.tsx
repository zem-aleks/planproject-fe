import { MilestonesBlock } from '@/modules/milestones/components/MilestonesBlock';
import { PhaseDescription } from '@/modules/phases/components/PhaseDescription';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { ProjectActions } from '@/modules/projects/components/ProjectActions';
import { ProjectStatusBadge } from '@/modules/projects/components/ProjectStatus';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';
import { notReachable } from '@/utils/notReachable';

export const RoadmapPage = () => {
  const { project, reload } = useProjectByUrlParam();
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
              {project.title} - Roadmap
              <ProjectStatusBadge status={project.status} />
            </h1>
            <p className={'text-muted-foreground'}>
              Overview of all project phases and their milestones
            </p>

            <ProjectActions
              project={project}
              onMsg={(msg) => {
                switch (msg.type) {
                  case 'onProjectStarted':
                  case 'onPhasesChanged':
                    reload();
                    break;

                  default:
                    return notReachable(msg);
                }
              }}
            />
          </div>
        </div>

        <PhasesLoader projectId={project.id}>
          {(phases) => (
            <Card className={'p-4 py-1'}>
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
                        {/*Actions*/}
                        {/*<div className={'mt-2 flex items-center gap-2'}>*/}
                        {/*  <Button size={'sm'} asChild>*/}
                        {/*    <Link*/}
                        {/*      to={`/project/${project.id}/phase/${phase.id}`}*/}
                        {/*    >*/}
                        {/*      View Phase Details*/}
                        {/*    </Link>*/}
                        {/*  </Button>*/}
                        {/*  {phase.status === 'inProgress' && (*/}
                        {/*    <CompletePhaseForm*/}
                        {/*      variant={'button'}*/}
                        {/*      phase={phase}*/}
                        {/*      onCompleted={(newPhase) => {*/}
                        {/*        setPhases(*/}
                        {/*          phases.map((p) =>*/}
                        {/*            p.id === newPhase.id*/}
                        {/*              ? {*/}
                        {/*                  ...newPhase,*/}
                        {/*                  milestones: phase.milestones,*/}
                        {/*                }*/}
                        {/*              : p,*/}
                        {/*          ),*/}
                        {/*        );*/}
                        {/*      }}*/}
                        {/*    />*/}
                        {/*  )}*/}
                        {/*  {phase.status === 'notStarted' && (*/}
                        {/*    <StartPhaseForm*/}
                        {/*      variant={'button'}*/}
                        {/*      phase={phase}*/}
                        {/*      onStarted={(newPhase) => {*/}
                        {/*        setPhases(*/}
                        {/*          phases.map((p) =>*/}
                        {/*            p.id === newPhase.id*/}
                        {/*              ? {*/}
                        {/*                  ...newPhase,*/}
                        {/*                  milestones: phase.milestones,*/}
                        {/*                }*/}
                        {/*              : p,*/}
                        {/*          ),*/}
                        {/*        );*/}
                        {/*      }}*/}
                        {/*    />*/}
                        {/*  )}*/}
                        {/*</div>*/}
                      </div>
                      <MilestonesBlock phase={phase} project={project} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          )}
        </PhasesLoader>
      </div>
    </PageTemplate>
  );
};
