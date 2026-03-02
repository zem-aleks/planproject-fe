import type { ReactNode } from 'react';

import {
  BookOpen,
  Crosshair,
  Gauge,
  Package,
  ShieldAlert,
  Target,
  Users,
  Wrench,
} from 'lucide-react';

import type {
  ProjectPreviewEntity,
  ProjectSoul,
} from '@/modules/projects/types/entity';
import { Badge } from '@/ui/badge';
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

      <ConstraintsSection soul={soul} />
      <TargetUsersSection targetUsers={soul.targetUsers ?? null} />

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
      // action={<EditButton />}
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
      // action={<EditButton />}
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

// const EditButton = () => (
//   <Button variant="ghost" size="icon" className="size-7">
//     <Pencil className="size-3.5" />
//   </Button>
// );

const TargetUsersSection = ({
  targetUsers,
}: {
  targetUsers: ProjectSoul['targetUsers'] | null;
}) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<Users className="size-4" />}
      title="Target Users"
      // action={<EditButton />}
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

const ResourcesSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<Wrench className="size-4" />}
      title="Resources & Tools"
      count={soul.resources.length}
      // action={<EditButton />}
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
      // action={<EditButton />}
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

const DomainContextSection = ({ soul }: { soul: ProjectSoul }) => (
  <Card className="flex flex-col gap-3 p-5">
    <SectionHeader
      icon={<BookOpen className="size-4" />}
      title="Domain Context"
      // action={<EditButton />}
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
