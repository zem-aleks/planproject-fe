import { Link } from 'react-router';

import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhasesTimeline } from '@/modules/phases/components/PhasesTimeline';
import { ProjectLogoBuilder } from '@/modules/projects/components/ProjectLogoBuilder';
import { ProjectNotFound } from '@/modules/projects/components/errors/ProjectNotFound';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
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
            <div>
              <span className={'text-2xl'}>Day 1</span>
              <Separator className={'my-2'} />
            </div>
            <h1 className={'flex items-center gap-2 text-2xl font-semibold'}>
              {project.title}
              <Badge>Status: {project.status}</Badge>
            </h1>
            <p className={'text-muted-foreground'}>
              {project.description || 'No description available'}
            </p>
          </div>
          <div className={'flex flex-col gap-2'}>
            {project.status === 'analyzing' && <Button>Start Project</Button>}

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
          </div>
        </div>

        <PhasesLoader projectId={project.id}>
          {(phases) => (
            <div className={'flex flex-col gap-4'}>
              <div className={'mb-4 flex flex-col gap-2'}>
                <h2 className={'text-lg font-semibold'}>Main phases</h2>
                <ol className={'flex flex-col gap-2'}>
                  {phases.map((phase, index) => (
                    <li key={phase.id} className={''}>
                      <div className={'flex items-center justify-between'}>
                        <Link to={`/project/${project.id}/phase/${phase.id}`}>
                          <Button variant={'link'} className={'px-0'}>
                            {index + 1}. {phase.title}
                          </Button>
                        </Link>
                        <div className={'text-sm'}>{phase.status}</div>
                      </div>
                      <Separator />
                      {/*<div className={'text-muted-foreground'}>*/}
                      {/*  {phase.description}*/}
                      {/*</div>*/}
                      {/*<div className={'text-sm'}>*/}
                      {/*  Estimation: {phase.minDaysNeeded} -{' '}*/}
                      {/*  {phase.maxDaysNeeded} days*/}
                      {/*</div>*/}
                      {/*<div className={'text-sm'}>*/}
                      {/*  Expertise needed: {phase.expertiseNeeded}*/}
                      {/*</div>*/}
                    </li>
                  ))}
                </ol>
              </div>
              <PhasesTimeline phases={phases} />
            </div>
          )}
        </PhasesLoader>

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
