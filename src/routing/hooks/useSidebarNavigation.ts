import { useContext } from 'react';
import { useLocation } from 'react-router';

import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import {
  Icon,
  IconAnalyze,
  IconDashboard,
  IconDatabase,
  IconPackages,
} from '@tabler/icons-react';

export type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  isActive?: boolean;
  subItems?: NavItem[];
};

export const useSidebarNavigation = (): NavItem[] => {
  const { pathname } = useLocation();
  const { projects } = useContext(ProjectsContext);
  const { project } = useProjectByUrlParam();

  const isProjectEditPage = pathname.startsWith('/projects/edit/');

  if (!project || isProjectEditPage) {
    return [
      {
        title: 'Projects',
        url: '/projects',
        icon: IconPackages,
        isActive: true,
        subItems: projects.map((proj) => ({
          title: proj.title,
          url: `/project/${proj.id}`,
          isActive: false,
        })),
      },
    ];
  }

  return [
    {
      title: 'Projects',
      url: '/projects',
      icon: IconPackages,
      isActive: false,
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: IconPackages,
      isActive: false,
    },
    {
      title: 'Dashboard',
      url: `/project/${project.id}`,
      icon: IconDashboard,
      isActive: false,
    },
    {
      title: 'Progress board',
      url: `/project/${project.id}/development`,
      icon: IconDatabase,
      isActive: false,
    },
    {
      title: 'Analysis board',
      url: `/project/${project.id}/analysis`,
      icon: IconAnalyze,
      isActive: false,
    },
  ].map((item) => ({ ...item, isActive: item.url.startsWith(pathname) }));
};
