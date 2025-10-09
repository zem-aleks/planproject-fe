import { useContext } from 'react';
import { Link, useLocation } from 'react-router';

import { Zap } from 'lucide-react';

import { ProjectsContext } from '@/modules/projects/contexts/ProjectsContext';
import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/ui/sidebar';
import {
  type Icon,
  IconAdjustmentsStar,
  IconPackages,
} from '@tabler/icons-react';

export type NavItem = {
  title: string;
  url: string;
  icon?: Icon;
  isActive?: boolean;
  subItems?: NavItem[];
};

export function NavMain() {
  const { pathname } = useLocation();
  const { projects } = useContext(ProjectsContext);
  const { project } = useProjectByUrlParam();

  if (!project) {
    return (
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem key={'projects'}>
              <Link to={'/projects'}>
                <SidebarMenuButton isActive={true}>
                  <IconPackages />
                  <span>Projects</span>
                </SidebarMenuButton>
              </Link>

              <SidebarMenuSub>
                {projects.map((project) => (
                  <SidebarMenuSubItem>
                    <Link to={`/project/${project.id}`}>
                      <SidebarMenuSubButton>
                        <span>{project.title}</span>
                      </SidebarMenuSubButton>
                    </Link>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      {/*<SidebarGroup>*/}
      {/*  <SidebarGroupContent className="flex flex-col gap-2">*/}
      {/*    <SidebarMenu>*/}
      {/*      <SidebarMenuItem key={'projects'}>*/}
      {/*        <Link to={'/projects'}>*/}
      {/*          <SidebarMenuButton>*/}
      {/*            <IconPackages />*/}
      {/*            <span>Projects</span>*/}
      {/*          </SidebarMenuButton>*/}
      {/*        </Link>*/}
      {/*      </SidebarMenuItem>*/}
      {/*    </SidebarMenu>*/}
      {/*    <SidebarSeparator />*/}
      {/*  </SidebarGroupContent>*/}
      {/*</SidebarGroup>*/}

      <SidebarGroup>
        <SidebarGroupLabel className={'mb-2 h-auto text-lg font-semibold'}>
          {project.title}
        </SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link to={`/project/${project.id}`}>
                <SidebarMenuButton
                  isActive={pathname === `/project/${project.id}`}
                >
                  <IconAdjustmentsStar />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            {project.status === 'active' && (
              <SidebarMenuItem>
                <Link to={`/project/${project.id}/workspace`}>
                  <SidebarMenuButton
                    isActive={pathname === `/project/${project.id}/workspace`}
                  >
                    <Zap />
                    <span>Workspace</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
