import { useContext } from 'react';
import { useLocation } from 'react-router';

import { SelectedProjectContext } from '@/modules/projects/contexts/SelectedProjectContext.tsx';
import { Icon, IconDashboard, IconUsers } from '@tabler/icons-react';

export type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  isActive?: boolean;
};

export const useSidebarNavigation = (): NavItem[] => {
  const { pathname } = useLocation();
  const { project } = useContext(SelectedProjectContext);

  if (!project) {
    return [
      {
        title: 'Projects',
        url: '/projects',
        icon: IconUsers,
        isActive: true,
      },
    ];
  }

  return [
    {
      title: 'Projects',
      url: '/projects',
      icon: IconUsers,
      isActive: false,
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
      isActive: false,
    },
  ].map((item) => ({ ...item, isActive: item.url.startsWith(pathname) }));
};
