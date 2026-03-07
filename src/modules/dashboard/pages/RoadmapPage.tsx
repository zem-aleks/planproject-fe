import { MilestonesBlock } from '@/modules/milestones/components/MilestonesBlock';
import { PhaseDescription } from '@/modules/phases/components/PhaseDescription';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { ProjectStatusBadge } from '@/modules/projects/components/ProjectStatus';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { ActiveProjectGuard } from '@/modules/subscriptions/guards/ActiveProjectGuard';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { Card } from '@/ui/card';
import { DaysCounter } from '@/ui/custom/DaysCounter';

export const RoadmapPage = () => {
  const { project } = useProjectByUrlParam();
  if (!project || project.status === 'draft') {
    return <ProjectNotFound />;
  }

  return (
    <ActiveProjectGuard>
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
                  'flex items-center justify-between gap-2 text-2xl font-semibold text-gray-200'
                }
              >
                {project.title} - Roadmap
                <ProjectStatusBadge status={project.status} />
              </h1>
              <p className={'text-gray-300'}>
                Overview of all project phases and their milestones. You can
                start the project immediately or modify the phases and
                milestones first.
              </p>
            </div>
          </div>

          <PhasesLoader projectId={project.id}>
            {(phases) => (
              <Card className={'p-4 py-1'}>
                <Accordion type="multiple">
                  {phases.map((phase, index) => (
                    <AccordionItem value={phase.id}>
                      <AccordionTrigger>
                        <div className={'flex items-center gap-2 text-lg'}>
                          {index + 1}. {phase.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className={'flex flex-col gap-2'}>
                        <div className={'mb-6'}>
                          <div className={'flex gap-4'}>
                            <PhaseDescription
                              phase={phase}
                              variant={'secondary'}
                            />

                            {phase.status === 'inProgress' && (
                              <DaysCounter
                                startedAt={phase.startedAt}
                                daysCount={phase.maxDaysNeeded}
                              />
                            )}
                          </div>
                        </div>
                        <MilestonesBlock phase={phase} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            )}
          </PhasesLoader>
        </div>
      </PageTemplate>
    </ActiveProjectGuard>
  );
};
