import { Link } from 'react-router';

import { NavItem, NavMain } from '@/ui/components/nav-main';
import { NavSecondary } from '@/ui/components/nav-secondary';
import { NavUser } from '@/ui/components/nav-user';
import { CircusLogo } from '@/ui/custom/CircusLogo.tsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/ui/sidebar';
import { IconHelp, IconSettings } from '@tabler/icons-react';

const data = {
  user: {
    name: 'Oleksii Zemliakov',
    email: 'nlight115@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },

  navClouds: [
    // {
    //   title: 'Capture',
    //   icon: IconCamera,
    //   isActive: true,
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Active Proposals',
    //       url: '#',
    //     },
    //     {
    //       title: 'Archived',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'Proposal',
    //   icon: IconFileDescription,
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Active Proposals',
    //       url: '#',
    //     },
    //     {
    //       title: 'Archived',
    //       url: '#',
    //     },
    //   ],
    // },
    // {
    //   title: 'Prompts',
    //   icon: IconFileAi,
    //   url: '#',
    //   items: [
    //     {
    //       title: 'Active Proposals',
    //       url: '#',
    //     },
    //     {
    //       title: 'Archived',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    // {
    //   title: 'Search',
    //   url: '#',
    //   icon: IconSearch,
    // },
  ],
  documents: [
    // {
    //   name: 'Data Library',
    //   url: '#',
    //   icon: IconDatabase,
    // },
    // {
    //   name: 'Reports',
    //   url: '#',
    //   icon: IconReport,
    // },
    // {
    //   name: 'Word Assistant',
    //   url: '#',
    //   icon: IconFileWord,
    // },
  ],
};

type Props = {
  navMain: NavItem[];
};

export function AppSidebar({ navMain }: Props) {
  return (
    <Sidebar collapsible="offcanvas" variant={'inset'}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={'/assistants'}>
                <CircusLogo />
                <span className="text-base font-semibold">CIRCUS GROUP</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/*<NavDocuments items={data.documents} />*/}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
