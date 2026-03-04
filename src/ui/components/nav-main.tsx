import { useState } from 'react';
import { Link, useLocation } from 'react-router';

import {
  BookOpen,
  ChartGantt,
  ChevronRight,
  ClipboardCheck,
  Compass,
  EqualApproximately,
  Layers,
  Lightbulb,
  Map,
  MessageCircle,
  PersonStanding,
  ShieldAlert,
  ShieldBan,
  Target,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';

import { useProjectByUrlParam } from '@/modules/projects/helpers/useProjectByUrlParam';
import type { ProjectSoul } from '@/modules/projects/types/entity';
import { cn } from '@/ui/lib/utils';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/ui/sidebar';
import { IconAdjustmentsStar, IconPackages } from '@tabler/icons-react';

export function NavMain() {
  const { pathname } = useLocation();
  // const { projects } = useContext(ProjectsContext);
  const { project } = useProjectByUrlParam();
  const isProjectEditPage = pathname.startsWith('/projects/edit/');
  const hasSoul = !!project?.soul;
  const isPlanned =
    project?.status === 'analyzing' ||
    project?.status === 'active' ||
    project?.status === 'completed' ||
    project?.status === 'onHold';

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
          {hasSoul && (
            <KnowledgeBaseMenu
              projectId={project.id}
              pathname={pathname}
              soul={project.soul!}
            />
          )}

          {isPlanned && (
            <>
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
              {project.competitorsUnlocked && (
                <SidebarMenuItem>
                  <Link to={`/project/${project.id}/competitors`}>
                    <SidebarMenuButton
                      isActive={
                        pathname === `/project/${project.id}/competitors`
                      }
                    >
                      <EqualApproximately />
                      <span>Competitors</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )}
              {project.auditoryUnlocked && (
                <SidebarMenuItem>
                  <Link to={`/project/${project.id}/auditory`}>
                    <SidebarMenuButton
                      isActive={pathname === `/project/${project.id}/auditory`}
                    >
                      <PersonStanding />
                      <span>Auditory</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )}
            </>
          )}

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

type KnowledgeBaseItem = {
  path: string;
  label: string;
  icon: typeof ClipboardCheck;
  getCount?: (soul: ProjectSoul) => number;
};

const KNOWLEDGE_BASE_ITEMS: KnowledgeBaseItem[] = [
  {
    path: 'open-questions',
    label: 'Open Questions',
    icon: ClipboardCheck,
    getCount: (soul) => soul.openQuestions.length,
  },
  {
    path: 'assumptions',
    label: 'Assumptions',
    icon: ShieldAlert,
    getCount: (soul) => soul.assumptions.length,
  },
  {
    path: 'workstreams',
    label: 'Workstreams',
    icon: Layers,
    getCount: (soul) => soul.workstreams.length,
  },
  {
    path: 'decisions',
    label: 'Decisions',
    icon: Lightbulb,
    getCount: (soul) => soul.decisions.length,
  },
  {
    path: 'desired-outcomes',
    label: 'Desired Outcomes',
    icon: Target,
    getCount: (soul) => soul.desiredOutcomes.length,
  },
  {
    path: 'constraints',
    label: 'Constraints',
    icon: ShieldBan,
    getCount: (soul) => soul.constraints.length,
  },
  {
    path: 'resources',
    label: 'Resources & Tools',
    icon: Wrench,
    getCount: (soul) => soul.resources.length,
  },
  { path: 'target-users', label: 'Target Users', icon: Users },
  { path: 'context', label: 'Project Context', icon: Compass },
];

const KnowledgeBaseMenu = ({
  projectId,
  pathname,
  soul,
}: {
  projectId: string;
  pathname: string;
  soul: ProjectSoul;
}) => {
  const isChildActive = KNOWLEDGE_BASE_ITEMS.some(
    (item) => pathname === `/project/${projectId}/${item.path}`,
  );
  const [open, setOpen] = useState(isChildActive);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton onClick={() => setOpen((o) => !o)}>
        <BookOpen />
        <span>Knowledge Base</span>
        <ChevronRight
          className={cn(
            'ml-auto size-4 transition-transform duration-200',
            open && 'rotate-90',
          )}
        />
      </SidebarMenuButton>
      {open && (
        <SidebarMenuSub>
          {KNOWLEDGE_BASE_ITEMS.map((item) => (
            <SidebarMenuSubItem key={item.path}>
              <Link to={`/project/${projectId}/${item.path}`}>
                <SidebarMenuSubButton
                  isActive={pathname === `/project/${projectId}/${item.path}`}
                >
                  <item.icon className="size-3.5" />
                  <span>{item.label}</span>
                  {item.getCount && <NavCount count={item.getCount(soul)} />}
                </SidebarMenuSubButton>
              </Link>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
};

const NavCount = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <span className="bg-primary/15 text-primary ml-auto flex size-5 items-center justify-center rounded-full text-[10px] font-semibold">
      {count}
    </span>
  );
};
