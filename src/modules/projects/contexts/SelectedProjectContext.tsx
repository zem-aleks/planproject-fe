import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext.tsx';
import { ProjectEntity } from '@/modules/projects/types/entity.ts';

type SelectedProjectContextData = {
  project: ProjectEntity | null;
  select: (project: ProjectEntity) => void;
  unselect: () => void;
};

const emptyContextValue: SelectedProjectContextData =
  {} as SelectedProjectContextData;

export const SelectedProjectContext =
  createContext<SelectedProjectContextData>(emptyContextValue);

export const SelectedProjectContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { projects } = useContext(ProjectsContext);
  const selectedProjectId = localStorage.getItem('selectedProjectId');
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || null;

  const [project, setProject] = useState<ProjectEntity | null>(selectedProject);

  const select = useCallback((newProject: ProjectEntity) => {
    localStorage.setItem('selectedProjectId', newProject.id);
    setProject(newProject);
  }, []);

  const unselect = useCallback(() => {
    localStorage.removeItem('selectedProjectId');
    setProject(null);
  }, []);

  return (
    <SelectedProjectContext.Provider value={{ project, select, unselect }}>
      {children}
    </SelectedProjectContext.Provider>
  );
};
