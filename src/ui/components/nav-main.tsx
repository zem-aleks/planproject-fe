import { Link, useLocation } from 'react-router';

import {
  ChartGantt,
  ClipboardCheck,
  EqualApproximately,
  Layers,
  Lightbulb,
  Lock,
  Map,
  MessageCircle,
  PersonStanding,
  ShieldAlert,
  Zap,
} from 'lucide-react';

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
                <SidebarMenuButton
                  isActive={pathname === `/projects`}
                  className={''}
                >
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
            <Link to={`/project/${project.id}/open-questions`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/open-questions`}
              >
                <ClipboardCheck />
                <span>Open Questions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to={`/project/${project.id}/assumptions`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/assumptions`}
              >
                <ShieldAlert />
                <span>Assumptions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to={`/project/${project.id}/workstreams`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/workstreams`}
              >
                <Layers />
                <span>Workstreams</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to={`/project/${project.id}/decisions`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/decisions`}
              >
                <Lightbulb />
                <span>Decisions</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to={`/project/${project.id}/roadmap`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/roadmap`}
              >
                {project.activated ? (
                  <Map />
                ) : (
                  <Lock className={'font-semibold text-yellow-500'} />
                )}
                <span>Roadmap</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Link to={`/project/${project.id}/chat`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/chat`}
              >
                <MessageCircle />
                <span>Chats</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to={`/project/${project.id}/competitors`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/competitors`}
              >
                {project.activated ? (
                  <EqualApproximately />
                ) : (
                  <Lock className={'font-semibold text-yellow-500'} />
                )}
                <span>Competitors</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link to={`/project/${project.id}/auditory`}>
              <SidebarMenuButton
                isActive={pathname === `/project/${project.id}/auditory`}
              >
                {project.activated ? (
                  <PersonStanding />
                ) : (
                  <Lock className={'font-semibold text-yellow-500'} />
                )}
                <span>Auditory</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>

          {project.status === 'active' && (
            <>
              <SidebarMenuItem>
                <Link to={`/project/${project.id}/focus`}>
                  <SidebarMenuButton
                    isActive={pathname === `/project/${project.id}/focus`}
                  >
                    <Zap />
                    <span>Focus Space</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link to={`/project/${project.id}/timeline`}>
                  <SidebarMenuButton
                    isActive={pathname === `/project/${project.id}/timeline`}
                  >
                    <ChartGantt />
                    <span>Timeline</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
