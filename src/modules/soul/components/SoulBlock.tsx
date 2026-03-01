import type { ReactNode } from 'react';

import {
  BookOpen,
  Check,
  CircleHelp,
  Crosshair,
  Gauge,
  Layers,
  Lightbulb,
  MessageCircle,
  Package,
  Pencil,
  Play,
  Plus,
  ShieldAlert,
  Target,
  Users,
  Wrench,
  X,
} from 'lucide-react';

import {
  ProjectPreviewEntity,
  ProjectSoul,
} from '@/modules/projects/types/entity';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Separator } from '@/ui/separator';

export const SoulBlock = ({ project }: { project: ProjectPreviewEntity }) => {
  const soul = project.soul;
  if (!soul) return null;

  return (
    <div className="flex flex-col gap-4">
      {/*<SoulHeader soul={soul} />*/}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CurrentStateSection soul={soul} />
        <DesiredOutcomesSection soul={soul} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TargetUsersSection targetUsers={soul.targetUsers ?? null} />
        <ConstraintsSection soul={soul} />
      </div>

      <OpenQuestionsSection soul={soul} />

      <AssumptionsSection soul={soul} />

      <DecisionsSection soul={soul} />

      <WorkstreamsSection soul={soul} />

      <ResourcesSection soul={soul} />

      <DomainContextSection soul={soul} />
    </div>
  );
};

const SectionHeader = ({
  icon,
  title,
  count,
  action,
}: {
  icon: ReactNode;
  title: string;
  count?: number;
  action?: ReactNode;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-muted-foreground">{icon}</span>
    <h3 className="text-base font-semibold">{title}</h3>
    {count != null && count > 0 && <Badge variant="secondary">{count}</Badge>}
    {action && <div className="ml-auto">{action}</div>}
  </div>
);

// const SoulHeader = ({ soul }: { soul: ProjectSoul }) => (
//   <Card className="flex flex-col gap-3 p-5">
//     <div className="flex items-start justify-between gap-3">
//       <div className="flex flex-col gap-1">
//         <h2 className="text-xl font-bold">{soul.name}</h2>
//         <Badge variant="outline" className="text-muted-foreground">
//           {soul.domain}
//         </Badge>
//       </div>
//       <BrainCircuit className="text-muted-foreground mt-1 size-6 shrink-0" />
//     </div>
//     <p className="text-muted-foreground text-sm leading-relaxed">
//       {soul.summary}
//     </p>
//   </Card>
// );

const CurrentStateSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<Gauge className="size-4" />}
      title="Current State"
      action={<EditButton />}
    />
    <p className="text-sm leading-relaxed">{soul.currentState.description}</p>
    {soul.currentState.keyMetrics &&
      soul.currentState.keyMetrics.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2">
            {soul.currentState.keyMetrics.map((metric) => (
              <Badge key={metric} variant="secondary">
                {metric}
              </Badge>
            ))}
          </div>
        </>
      )}
  </Card>
);

const DesiredOutcomesSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<Target className="size-4" />}
      title="Desired Outcomes"
      count={soul.desiredOutcomes.length}
      action={<EditButton />}
    />
    {soul.desiredOutcomes.length > 0 ? (
      <ul className="flex flex-col gap-2">
        {soul.desiredOutcomes.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Crosshair className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <span className="leading-relaxed">
              {item.outcome}
              {item.inferred && (
                <Badge variant="outline" className="ml-2 text-[10px]">
                  Suggested
                </Badge>
              )}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-muted-foreground text-sm">
        No desired outcomes defined yet
      </p>
    )}
  </Card>
);

const EditButton = () => (
  <Button variant="ghost" size="icon" className="size-7">
    <Pencil className="size-3.5" />
  </Button>
);

const TargetUsersSection = ({
  targetUsers,
}: {
  targetUsers: ProjectSoul['targetUsers'] | null;
}) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<Users className="size-4" />}
      title="Target Users"
      action={<EditButton />}
    />
    {targetUsers ? (
      <>
        <p className="text-sm leading-relaxed">{targetUsers.description}</p>
        {targetUsers.segments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {targetUsers.segments.map((segment) => (
              <Badge key={segment} variant="secondary">
                {segment}
              </Badge>
            ))}
          </div>
        )}
      </>
    ) : (
      <p className="text-muted-foreground text-sm">
        No target users defined yet
      </p>
    )}
  </Card>
);

const WorkstreamsSection = ({ soul }: { soul: ProjectSoul }) => {
  const priorityOrder = { must: 0, should: 1, 'nice-to-have': 2 } as const;
  const sorted = [...soul.workstreams].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  return (
    <Card className="flex flex-col gap-3 p-5">
      <SectionHeader
        icon={<Layers className="size-4" />}
        title="Workstreams"
        count={soul.workstreams.length}
        action={<EditButton />}
      />
      {sorted.length > 0 ? (
        <div className="flex flex-col gap-2">
          {sorted.map((ws, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{ws.name}</span>
                  {ws.inferred && (
                    <Badge variant="outline" className="text-[10px]">
                      Suggested
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {ws.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <PriorityBadge priority={ws.priority} />
                <Button variant="outline" size="sm">
                  <Play className="size-3.5" />
                  Start working
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No workstreams defined yet
        </p>
      )}
    </Card>
  );
};

const PriorityBadge = ({
  priority,
}: {
  priority: 'must' | 'should' | 'nice-to-have';
}) => {
  switch (priority) {
    case 'must':
      return <Badge variant="default">must</Badge>;
    case 'should':
      return <Badge variant="secondary">should</Badge>;
    case 'nice-to-have':
      return <Badge variant="outline">nice-to-have</Badge>;
  }
};

const ResourcesSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<Wrench className="size-4" />}
      title="Resources & Tools"
      count={soul.resources.length}
      action={<EditButton />}
    />
    {soul.resources.length > 0 ? (
      <div className="flex flex-col gap-2">
        {soul.resources.map((res, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <Package className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />
            <div>
              <span className="font-medium">{res.name}</span>
              {res.tentative && (
                <Badge variant="outline" className="ml-2 text-[10px]">
                  tentative
                </Badge>
              )}
              <p className="text-muted-foreground text-xs">{res.relevance}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-sm">No resources added yet</p>
    )}
  </Card>
);

const ConstraintsSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<ShieldAlert className="size-4" />}
      title="Constraints"
      count={soul.constraints.length}
      action={<EditButton />}
    />
    {soul.constraints.length > 0 ? (
      <div className="flex flex-col gap-2">
        {soul.constraints.map((c, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <Badge variant="outline" className="mt-0.5 shrink-0 text-[10px]">
              {c.type}
            </Badge>
            <span className="leading-relaxed">{c.description}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-sm">
        No constraints defined yet
      </p>
    )}
  </Card>
);

const DecisionsSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<Lightbulb className="size-4" />}
      title="Decisions Made"
      count={soul.decisions.length}
      action={<EditButton />}
    />
    {soul.decisions.length > 0 ? (
      <div className="flex flex-col gap-2">
        {soul.decisions.map((d, i) => (
          <div key={i} className="rounded-lg border p-3">
            <div className="text-sm font-medium">{d.topic}</div>
            <div className="mt-1 flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-3.5 shrink-0 text-green-500" />
              <span className="leading-relaxed">{d.chosen}</span>
            </div>
            {d.rationale && (
              <p className="text-muted-foreground mt-1 pl-5.5 text-xs">
                {d.rationale}
              </p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-sm">No decisions made yet</p>
    )}
  </Card>
);

const OpenQuestionsSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<CircleHelp className="size-4" />}
      title="Open Questions"
      count={soul.openQuestions.length}
      action={<EditButton />}
    />
    {soul.openQuestions.length > 0 ? (
      <div className="flex flex-col gap-3">
        {soul.openQuestions.map((q, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-sm font-medium">{q.topic}</div>
                {q.context && (
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {q.context}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Badge
                  variant={
                    q.status === 'discussed_unresolved'
                      ? 'warning'
                      : 'secondary'
                  }
                >
                  {q.status === 'discussed_unresolved'
                    ? 'unresolved'
                    : 'not discussed'}
                </Badge>
                <Button variant="ghost" size="sm">
                  <X className="size-3.5" />
                  Remove
                </Button>
              </div>
            </div>

            {q.suggestedOptions && q.suggestedOptions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {q.suggestedOptions.map((opt, j) => (
                  <Badge
                    key={j}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {opt}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-3" />

            <div className="flex gap-2">
              <Button variant="default" size="sm">
                <Lightbulb className="size-3.5" />
                Make a decision
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="size-3.5" />
                Start a chat
              </Button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-sm">No open questions yet</p>
    )}
    <Button variant="outline" size="sm" className="self-start">
      <Plus className="size-3.5" />
      Add question
    </Button>
  </Card>
);

const AssumptionsSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<ShieldAlert className="size-4" />}
      title="Assumptions"
      count={soul.assumptions.length}
      action={<EditButton />}
    />
    {soul.assumptions.length > 0 ? (
      <div className="flex flex-col gap-3">
        {soul.assumptions.map((a, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="text-sm font-medium">{a.assumption}</div>
            <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
              {a.reasoning}
            </p>

            {a.affectedAreas.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {a.affectedAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="text-[10px]">
                    {area}
                  </Badge>
                ))}
              </div>
            )}

            <Separator className="my-3" />

            <div className="flex gap-2">
              <Button variant="default" size="sm">
                <Check className="size-3.5" />
                Accept
              </Button>
              <Button variant="outline" size="sm">
                <X className="size-3.5" />
                Reject
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="size-3.5" />
                Talk
              </Button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-sm">No assumptions yet</p>
    )}
  </Card>
);

const DomainContextSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<BookOpen className="size-4" />}
      title="Domain Context"
      action={<EditButton />}
    />
    {soul.domainContext.length > 0 ? (
      <ul className="flex flex-col gap-1.5">
        {soul.domainContext.map((ctx, i) => (
          <li
            key={i}
            className="text-muted-foreground flex items-start gap-2 text-sm"
          >
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
            <span className="leading-relaxed">{ctx}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-muted-foreground text-sm">
        No domain context added yet
      </p>
    )}
  </Card>
);
