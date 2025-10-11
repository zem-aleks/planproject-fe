import { MilestonesList } from '@/modules/milestones/components/MilestonesList';
import { PhaseDescription } from '@/modules/phases/components/PhaseDescription';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
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
          {(phases) => (
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
                      <div className={'flex gap-2'}>
                        <PhaseDescription phase={phase} />
                        {phase.status === 'inProgress' && (
                          <DaysCounter
                            startedAt={phase.startedAt}
                            daysCount={phase.maxDaysNeeded}
                          />
                        )}
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
