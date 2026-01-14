import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';

import { NewProjectsChecker } from '@/modules/projects/components/NewProjectsChecker';
import {
  ProjectCard,
  Msg as ProjectCardMsg,
} from '@/modules/projects/components/card/ProjectCard.tsx';
import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext.tsx';
import { SelectedProjectContext } from '@/modules/projects/contexts/SelectedProjectContext.tsx';
import { ProjectEntity } from '@/modules/projects/types/entity';
import { PageTemplate } from '@/modules/templates/components/PageTemplate.tsx';
import { Button } from '@/ui/button.tsx';
import { notReachable } from '@/utils/notReachable.ts';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, reload } = useContext(ProjectsContext);
  const { select } = useContext(SelectedProjectContext);

  return (
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
        onConnected={(newProject) => {
          reload();
          if (newProject.status === 'draft') {
            navigate(`/projects/edit/${newProject.id}`);
          } else {
            navigate(`/project/${newProject.id}?new=true`);
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
  );
};

const ProjectsList = ({
  projects,
  onMsg,
}: {
  projects: ProjectEntity[];
  onMsg: (msg: ProjectCardMsg) => void;
}) => {
  if (projects.length === 0) {
    return (
      <div className={'text-md text-muted-foreground px-4 lg:px-6'}>
        No projects yet!
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onMsg={onMsg} />
        ))}
      </div>
    </div>
  );
};
