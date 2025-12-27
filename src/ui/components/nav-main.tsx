import { Link, useLocation } from 'react-router';

import { Map, Zap } from 'lucide-react';

import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/ui/sidebar';
import { IconAdjustmentsStar, IconPackages } from '@tabler/icons-react';

export function NavMain() {
  const { pathname } = useLocation();
  // const { projects } = useContext(ProjectsContext);
  const { project } = useProjectByUrlParam();
  const isProjectEditPage = pathname.startsWith('/projects/edit/');

  if (!project || isProjectEditPage) {
    return (
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem key={'projects'}>
              <Link to={'/projects'}>
                <SidebarMenuButton isActive={true} className={''}>
                  <IconPackages />
                  <span>All Projects</span>
                </SidebarMenuButton>
              </Link>

              {/*<SidebarMenuSub>*/}
              {/*  {projects.map((project) => (*/}
              {/*    <SidebarMenuSubItem>*/}
              {/*      <Link*/}
              {/*        to={*/}
              {/*          project.status === 'draft'*/}
              {/*            ? `/projects/edit/${project.id}`*/}
              {/*            : `/project/${project.id}`*/}
              {/*        }*/}
              {/*      >*/}
              {/*        <SidebarMenuSubButton>*/}
              {/*          <span>{project.title}</span>*/}
              {/*        </SidebarMenuSubButton>*/}
              {/*      </Link>*/}
              {/*    </SidebarMenuSubItem>*/}
              {/*  ))}*/}
              {/*</SidebarMenuSub>*/}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
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
          <SidebarMenuItem>
            <Link to={`/project/${project.id}/roadmap`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/roadmap`}
              >
                <Map />
                <span>Roadmap</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          {project.status === 'active' && (
            <SidebarMenuItem>
              <Link to={`/project/${project.id}/tasks`}>
                <SidebarMenuButton
                  isActive={pathname === `/project/${project.id}/tasks`}
                >
                  <Zap />
                  <span>Tasks</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
