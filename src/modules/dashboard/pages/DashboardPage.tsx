import dayjs from 'dayjs';

import { PhaseItemBuilder } from '@/modules/phases/components/PhaseItemBuilder';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhasesTimeline } from '@/modules/phases/components/PhasesTimeline';
import { ProjectLogoBuilder } from '@/modules/projects/components/ProjectLogoBuilder';
import { StartProjectForm } from '@/modules/projects/components/StartProjectForm';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { FinishShapingFormInternal } from '@/modules/shaping/components/FinishShapingFormInternal';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Separator } from '@/ui/separator';
import { notReachable } from '@/utils/notReachable';

export const DashboardPage = () => {
  const { project, reload } = useProjectByUrlParam();
  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <PageTemplate
      header={{
        breadcrumbs: [{ title: 'Projects', href: '/projects' }],
        title: `${project.title}`,
      }}
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className={'flex flex-row gap-8'}>
          <div className="flex flex-col gap-1">
            {/*<div>*/}
            {/*  <span className={'text-2xl'}>Day 1</span>*/}
            {/*  <Separator className={'my-2'} />*/}
            {/*</div>*/}

            <h1
              className={
                'flex items-center justify-between gap-2 text-2xl font-semibold'
              }
            >
              {project.title}
              <Badge>Status: {project.status}</Badge>
            </h1>
            <p className={'text-muted-foreground'}>
              {project.description || 'No description available'}
            </p>

            <StartProjectForm project={project} onStarted={reload} />

            <Button className={'mt-2'}>Show tasks</Button>
          </div>
          <div className={'flex flex-col gap-2'}>
            <ProjectLogoBuilder
              project={project}
              onMsg={(msg) => {
                switch (msg.type) {
                  case 'onProjectUpdated':
                    reload();
                    break;

                  default:
                    return notReachable(msg.type);
                }
              }}
            />
            {project.status === 'active' && (
              <div className={'mb-2 self-start rounded-lg border p-2 shadow'}>
                <div className={'text-2xl'}>
                  Day {dayjs().diff(project.startedAt, 'days') + 1}
                </div>
                <Separator className={'my-2'} />
                Out of {project.daysNeeded || 'N/A'} days
              </div>
            )}
          </div>
        </div>

        {project.status === 'shaping' ? (
          <FinishShapingFormInternal
            shapingId={project.shapingId}
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onFinish':
                  reload();
                  break;

                default:
                  return notReachable(msg.type);
              }
            }}
          />
        ) : (
          <PhasesLoader projectId={project.id}>
            {(phases) => (
              <div className={'mt-4 flex flex-col gap-4'}>
                <div className={'mb-4 flex flex-col gap-2'}>
                  <div className={'flex items-center justify-between gap-2'}>
                    <h2 className={'text-lg font-semibold'}>Main phases</h2>
                    {project.status === 'analyzing' && (
                      <Button
                        variant={'outline'}
                        size={'sm'}
                        onClick={() => alert('Coming soon!')}
                      >
                        Modify Phases
                      </Button>
                    )}
                  </div>
                  <ol className={'flex flex-col gap-2'}>
                    {/* TODO: build separated components for loading and built states */}
                    {phases.map((phase, index) => (
                      <li key={phase.id} className={''}>
                        <PhaseItemBuilder
                          phase={phase}
                          project={project}
                          index={index}
                        />
                        <Separator />
                      </li>
                    ))}
                  </ol>
                </div>
                <PhasesTimeline phases={phases} />
              </div>
            )}
          </PhasesLoader>
        )}

        {/*<ChartAreaInteractive />*/}

        {/*{project.status === 'analyzing' && <PhasesBlock project={project} />}*/}

        {/*{project.status === 'shaping' && (*/}
        {/*  <ShapingLoader projectId={project.id}>*/}
        {/*    {(shaping, setData) => (*/}
        {/*      <ShapingForm*/}
        {/*        project={project}*/}
        {/*        shaping={shaping}*/}
        {/*        onMsg={(msg) => {*/}
        {/*          switch (msg.type) {*/}
        {/*            case 'onUpdate':*/}
        {/*              setData(msg.shaping);*/}
        {/*              break;*/}

        {/*            case 'onFinish':*/}
        {/*              reload();*/}
        {/*              break;*/}

        {/*            default:*/}
        {/*              return notReachable(msg);*/}
        {/*          }*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </ShapingLoader>*/}
        {/*)}*/}
      </div>
    </PageTemplate>
  );
};
