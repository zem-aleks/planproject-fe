import { Link } from 'react-router';

import { NavMain } from '@/ui/components/nav-main';
import { NavSecondary } from '@/ui/components/nav-secondary';
import { NavUser } from '@/ui/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/ui/sidebar';

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
    // {
    //   title: 'Settings',
    //   url: '#',
    //   icon: IconSettings,
    // },
    // {
    //   title: 'Get Help',
    //   url: '#',
    //   icon: IconHelp,
    // },
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

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" variant={'inset'}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={'/projects'}>
                <span className="text-base font-semibold">Plan Project</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        {/*<NavDocuments items={data.documents} />*/}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
