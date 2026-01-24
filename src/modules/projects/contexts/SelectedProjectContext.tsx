import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext.tsx';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity.ts';
import { noOperation } from '@/utils/notReachable';

type SelectedProjectContextData = {
  project: ProjectPreviewEntity | null;
  select: (project: ProjectPreviewEntity) => void;
  unselect: () => void;
};

const emptyContextValue: SelectedProjectContextData = {
  project: null,
  select: noOperation,
  unselect: noOperation,
};

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

  const [project, setProject] = useState<ProjectPreviewEntity | null>(
    selectedProject,
  );

  const select = useCallback((newProject: ProjectPreviewEntity) => {
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
