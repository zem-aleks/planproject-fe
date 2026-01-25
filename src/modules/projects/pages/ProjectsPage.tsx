import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';

import { NewProjectsChecker } from '@/modules/projects/components/NewProjectsChecker';
import { ProjectsLoader } from '@/modules/projects/components/ProjectsLoader';
import {
  ProjectCard,
  Msg as ProjectCardMsg,
} from '@/modules/projects/components/card/ProjectCard.tsx';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext.tsx';
import { SelectedProjectContext } from '@/modules/projects/contexts/SelectedProjectContext.tsx';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Button } from '@/ui/button.tsx';
import { Card } from '@/ui/card';
import { notReachable } from '@/utils/notReachable.ts';
import { IconAdjustmentsStar } from '@tabler/icons-react';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { reload } = useContext(ProjectsContext);
  const { select } = useContext(SelectedProjectContext);

  return (
    <ProjectsLoader>
      {(projects) => (
        <PageTemplate
          header={{
            breadcrumbs: [],
            title: 'Projects',
            actions: (
              // <CreateProjectAction />
              <Button asChild size="sm" className="hidden sm:flex">
                <Link to={'/projects/create'}>Create Project</Link>
              </Button>
            ),
          }}
        >
          <NewProjectsChecker
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onNothingToConnect':
                  break;

                case 'onConnected': {
                  reload();
                  if (msg.project.status === 'draft') {
                    navigate(`/projects/edit/${msg.project.id}`);
                  } else if (msg.project.activated) {
                    navigate(`/project/${msg.project.id}?new=true`);
                  } else {
                    navigate(`/project/${msg.project.id}`);
                  }
                  break;
                }

                default:
                  notReachable(msg);
              }
            }}
          />

          <ProjectsList
            projects={projects}
            onMsg={(msg) => {
              switch (msg.type) {
                case 'onProjectSelect': {
                  if (msg.project.status === 'draft') {
                    return navigate(`/projects/edit/${msg.project.id}`);
                  }
                  select(msg.project);
                  navigate(`/project/${msg.project.id}`);
                  break;
                }

                case 'onProjectEdit':
                  navigate(`/projects/edit/${msg.project.id}`);
                  break;

                case 'onProjectDeleted':
                  reload();
                  break;

                default:
                  return notReachable(msg);
              }
            }}
          />
        </PageTemplate>
      )}
    </ProjectsLoader>
  );
};

const ProjectsList = ({
  projects,
  onMsg,
}: {
  projects: ProjectPreviewEntity[];
  onMsg: (msg: ProjectCardMsg) => void;
}) => {
  if (projects.length === 0) {
    return (
      <Card
        className={
          'text-md text-muted-foreground mx-4 items-center justify-center gap-4 p-8'
        }
      >
        <IconAdjustmentsStar className={'size-20 text-green-600'} />
        No projects yet! You can start by creating your first project
        <Button asChild size="sm" className="hidden sm:flex">
          <Link to={'/projects/create'}>Create Project</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-1 xl:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onMsg={onMsg} />
        ))}
      </div>
    </div>
  );
};
