import { ReactNode } from 'react';

import { Mars, Venus } from 'lucide-react';
import { LabelList, Pie, PieChart } from 'recharts';

import { createAuditoryDetails } from '@/modules/auditory/api/createAuditoryDetails';
import { createAuditoryInfo } from '@/modules/auditory/api/createAuditoryInfo';
import {
  AuditoryAgeSegment,
  AuditoryCharacter,
  AuditoryEntity,
  AuditorySegment,
} from '@/modules/auditory/types/entity';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/chart';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { Separator } from '@/ui/separator';
import { Skeleton } from '@/ui/skeleton';
import { notReachable } from '@/utils/notReachable';
import { useLoadableData } from '@/utils/useLoadableData';

type Props = {
  project: ProjectPreviewEntity;
  auditory: AuditoryEntity;
};

export const AuditoryContent = ({ project, auditory }: Props): ReactNode => {
  return (
    <div className={'flex flex-col gap-10'}>
      <AuditoryInfo auditory={auditory} project={project} />
      <AuditoryDetails auditory={auditory} project={project} />
    </div>
  );
};

const AuditoryInfo = ({ project, auditory }: Props) => {
  const hasInfo = auditory.menPercentage > 0;
  if (!hasInfo) {
    return <AuditoryInfoLoader project={project} auditory={auditory} />;
  }

  return <AuditoryInfoCard auditory={auditory} />;
};

const AuditoryDetails = ({ project, auditory }: Props) => {
  const hasInfo = auditory.mainSegments.length > 0;
  if (!hasInfo) {
    return <AuditoryDetailsLoader project={project} auditory={auditory} />;
  }

  return <AuditoryDetailsCard auditory={auditory} />;
};

const AuditoryInfoLoader = ({ project }: Props) => {
  const { state, reload } = useLoadableData(createAuditoryInfo, project.id);

  switch (state.type) {
    case 'loading':
      return (
        <div className={'flex flex-col gap-2'}>
          <Skeleton className={'h-40 w-full'} />
        </div>
      );

    case 'loaded':
      return <AuditoryInfoCard auditory={state.data} />;

    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>Auditory Info loading error</p>
          <p className={'pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </Card>
      );

    default:
      return notReachable(state);
  }
};

const AuditoryDetailsLoader = ({ project }: Props) => {
  const { state, reload } = useLoadableData(createAuditoryDetails, project.id);

  switch (state.type) {
    case 'loading':
      return (
        <div className={'flex flex-col gap-2'}>
          <Skeleton className={'h-40 w-full'} />
        </div>
      );

    case 'loaded':
      return <AuditoryDetailsCard auditory={state.data} />;

    case 'error':
      return (
        <Card className={'flex flex-col items-center gap-2 py-4'}>
          <p className={'text-xl text-red-700'}>
            Auditory Details loading error
          </p>
          <p className={'pb-2'}>{state.error.message}</p>
          <Button onClick={reload}>Try again</Button>
        </Card>
      );

    default:
      return notReachable(state);
  }
};

const AuditoryInfoCard = ({ auditory }: { auditory: AuditoryEntity }) => {
  return (
    <div className={'flex flex-col gap-2'}>
      <GenderCard menPercentage={auditory.menPercentage} />
      <AgeCard ageSeparation={auditory.ageSeparation} />

      <div className={'flex w-full flex-row gap-2'}>
        <MarketCard
          value={auditory.tam}
          label="TAM"
          description="Total Addressable Market"
        />
        <MarketCard
          value={auditory.sam}
          label="SAM"
          description="Serviceable Addressable Market"
        />
        <MarketCard
          value={auditory.som}
          label="SOM"
          description="Serviceable Obtainable Market"
        />
      </div>
    </div>
  );
};

const AuditoryDetailsCard = ({ auditory }: { auditory: AuditoryEntity }) => {
  return (
    <div className={'flex flex-col gap-8'}>
      <div className={'flex flex-col gap-4'}>
        <div className={'text-2xl font-semibold'}>Main Auditory Segments</div>
        <MainSegmentsList segments={auditory.mainSegments} />
      </div>
      <div className={'flex flex-col gap-4'}>
        <div className={'text-2xl font-semibold'}>Characters Examples</div>
        <CharactersList characters={auditory.characters} />
      </div>
      <div className={'flex flex-col gap-4'}>
        <div className={'text-2xl font-semibold'}>What Auditory wants?</div>
        <MarkdownFormat>{auditory.auditoryDemands}</MarkdownFormat>
      </div>

      <div className={'flex flex-col gap-4'}>
        <div className={'text-2xl font-semibold'}>Auditory Pain</div>
        <MarkdownFormat>{auditory.auditoryPains}</MarkdownFormat>
      </div>

      <div className={'flex flex-col gap-4'}>
        <div className={'text-2xl font-semibold'}>
          What can make you unique?
        </div>
        <MarkdownFormat>{auditory.differentiation}</MarkdownFormat>
      </div>

      <div className={'flex flex-col gap-4'}>
        <div className={'text-2xl font-semibold'}>
          Channels of auditory attraction
        </div>
        <MarkdownFormat>{auditory.auditoryChannels}</MarkdownFormat>
      </div>
    </div>
  );
};

const MainSegmentsList = ({ segments }: { segments: AuditorySegment[] }) => {
  return (
    <div className={'flex flex-col gap-2'}>
      {segments.map((segment, index) => (
        <Card className={'flex justify-between gap-4 p-4 py-2'}>
          <div className={'flex gap-4'}>
            <div
              className={
                'mt-2 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-green-600 text-xl font-semibold'
              }
            >
              {index + 1}
            </div>

            <div>
              <div className={'text-2xl font-semibold'}>{segment.title}</div>
              <div>
                <MarkdownFormat>{segment.description}</MarkdownFormat>
              </div>

              <Separator className={'my-2'} />

              <div>
                <b>Motivation:</b> {segment.motivation}
              </div>
              <div>
                <b>Pain:</b> {segment.pain}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const CharactersList = ({
  characters,
}: {
  characters: AuditoryCharacter[];
}) => {
  return (
    <div className={'flex flex-col gap-2'}>
      {characters.map((character, index) => (
        <Card className={'flex justify-between gap-4 p-4 py-2'}>
          <div className={'flex gap-4'}>
            <div
              className={
                'mt-2 flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 text-xl font-semibold'
              }
            >
              {index + 1}
            </div>

            <div>
              <div className={'text-2xl font-semibold'}>{character.title}</div>
              <div>
                <MarkdownFormat>{character.description}</MarkdownFormat>
              </div>

              <Separator className={'my-2'} />

              <div>
                <b>Usage Scenario:</b> {character.usageScenario}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

const GenderCard = ({ menPercentage }: { menPercentage: number }) => {
  return (
    <Card className={'flex flex-row items-center justify-center gap-2'}>
      <div className={'flex grow flex-col items-center justify-center gap-1'}>
        <div
          className={
            'flex flex-col items-center text-2xl font-semibold text-blue-400'
          }
        >
          <Mars />
          Men
        </div>
        <div className={'text-3xl font-semibold'}>{menPercentage}%</div>
      </div>
      <Separator orientation={'vertical'} />
      <div className={'flex grow flex-col items-center justify-center gap-1'}>
        <div
          className={
            'flex flex-col items-center text-2xl font-semibold text-pink-700'
          }
        >
          <Venus /> Women
        </div>
        <div className={'text-3xl font-semibold'}>{100 - menPercentage}%</div>
      </div>
    </Card>
  );
};

const AgeCard = ({
  ageSeparation,
}: {
  ageSeparation: AuditoryAgeSegment[];
}) => {
  const chartConfig = {
    // men: {
    //   label: 'Men',
    //   color: 'var(--chart-1)',
    // },
    // women: {
    //   label: 'Women',
    //   color: 'var(--chart-5)',
    // },
  };

  ageSeparation.forEach((ageSegment, index) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    chartConfig[ageSegment.ageInterval] = {
      label: `${ageSegment.ageInterval} - `,
      color: `var(--chart-${index + 1})`,
    };
  });

  return (
    <Card className={'flex flex-col gap-2'}>
      <div className={'px-4 text-center text-3xl font-semibold'}>
        Age Segmentation
      </div>
      <ChartContainer
        config={chartConfig}
        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square h-64 w-full"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={ageSeparation.map((ageSegment, index) => ({
              ...ageSegment,
              fill: `var(--chart-${index + 1})`,
            }))}
            dataKey="percentage"
            nameKey="ageInterval"
            label={({ payload, ...props }) => {
              return (
                <text
                  cx={props.cx}
                  cy={props.cy}
                  x={props.x}
                  y={props.y}
                  textAnchor={props.textAnchor}
                  dominantBaseline={props.dominantBaseline}
                  fill="hsla(var(--foreground))"
                >
                  {payload.ageInterval} - {payload.percentage}%
                </text>
              );
            }}
          >
            <LabelList
              dataKey="percentage"
              className="fill-background"
              stroke="none"
              fontSize={12}
              position="inside"
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </Card>
  );
};

const MarketCard = ({
  value,
  label,
  description,
}: {
  value: string;
  label: string;
  description: string;
}) => {
  return (
    <Card className={'flex grow items-center justify-center gap-0 px-4'}>
      <div className={'text-2xl font-semibold'}>{label}</div>
      <div className={'text-muted-foreground'}>{description}</div>
      <div className={'text-center font-semibold'}>{value}</div>
    </Card>
  );
};
