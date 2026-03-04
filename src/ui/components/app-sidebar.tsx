import { Link } from 'react-router';

import { LogoBlock } from '@/modules/home/components/LogoBlock';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import { NavMain } from '@/ui/components/nav-main';
import { NavSecondary } from '@/ui/components/nav-secondary';
import { NavUser } from '@/ui/components/nav-user';
import { Separator } from '@/ui/separator';
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
  const { project } = useProjectByUrlParam();

  return (
    <Sidebar collapsible="offcanvas" variant={'inset'}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {project ? (
              <Link
                to={`/project/${project.id}`}
                className="bg-accent/60 ring-border/50 flex items-center gap-3 rounded-lg px-3 py-2.5 ring-1"
              >
                {project.logoUrl ? (
                  <img
                    src={project.logoUrl}
                    alt={project.title}
                    className="ring-border/40 size-10 shrink-0 rounded-lg object-cover shadow-sm ring-1"
                  />
                ) : (
                  <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 shrink-0 items-center justify-center rounded-lg text-base font-semibold shadow-sm ring-1">
                    {project.title.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="line-clamp-3 text-sm font-semibold">
                  {project.title}
                </span>
              </Link>
            ) : (
              <SidebarMenuButton asChild className="h-10 px-4">
                <Link to={'/projects'}>
                  <LogoBlock />
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        {/*<NavDocuments items={data.documents} />*/}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className={'mb-20 md:mb-0'}>
        <Separator className={'md:hidden'} />
        <NavUser />
        <Separator className={'md:hidden'} />
      </SidebarFooter>
    </Sidebar>
  );
}
