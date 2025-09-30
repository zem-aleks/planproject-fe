import { useLocation } from 'react-router';

import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { Icon, IconHome, IconPackages } from '@tabler/icons-react';

export type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  isActive?: boolean;
};

export const useSidebarNavigation = (): NavItem[] => {
  const { pathname } = useLocation();
  const { project } = useProjectByUrlParam();

  if (!project) {
    return [
      {
        title: 'Projects',
        url: '/projects',
        icon: IconPackages,
        isActive: true,
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
      title: 'Home',
      url: `/project/${project.id}`,
      icon: IconHome,
      isActive: false,
    },
  ].map((item) => ({ ...item, isActive: item.url.startsWith(pathname) }));
};
