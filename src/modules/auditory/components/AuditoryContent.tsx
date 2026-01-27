import { ReactNode } from 'react';
import { Link } from 'react-router';

import { Mars, ShieldEllipsis, Venus } from 'lucide-react';
import { LabelList, Pie, PieChart } from 'recharts';

import {
  AuditoryAgeSegment,
  AuditoryBasicData,
  AuditoryCharacter,
  AuditoryData,
  AuditorySegment,
} from '@/modules/auditory/types/entity';
import { useUser } from '@/modules/auth/contexts/UserContext';
import { ProjectPreviewEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/chart';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { Separator } from '@/ui/separator';

type Props = {
  project: ProjectPreviewEntity;
  auditory: AuditoryData;
};

export const AuditoryContent = ({ auditory }: Props): ReactNode => {
  const { user } = useUser();
  return (
    <div className={'flex flex-col gap-10'}>
      <AuditoryInfoCard auditory={auditory.basic} />
      <AuditoryDetailsCard auditory={auditory} />

      {user?.subscription === 'basic' && (
        <Card className={'flex items-center justify-center gap-4 p-4 py-8'}>
          <div className={'text-center'}>
            <div className={'text-foreground mb-2 text-2xl font-semibold'}>
              Upgrade Subscription to get more Auditory insights
            </div>
          </div>
          <ShieldEllipsis className={'my-4 size-20 text-orange-400'} />
          <Button variant={'default'} asChild>
            <Link to={'/account'}>Upgrade Subscription</Link>
          </Button>
          <div className={'xs:grid-cols-1 mt-4 grid gap-8 lg:grid-cols-2'}>
            <div>
              <b>Pro Plan</b> provides access to:
              <Separator className={'my-2'} />
              <ul className={'text-muted-foreground'}>
                <li>Auditory Segments</li>
                <li>What Auditory wants</li>
                <li>Auditory Pains</li>
              </ul>
            </div>

            <div>
              <b>Business Plan</b> also provides access to:
              <Separator className={'my-2'} />
              <ul className={'text-muted-foreground'}>
                <li>Characters Examples</li>
                <li>What can make you unique?</li>
                <li>Channels of auditory attraction</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {user?.subscription === 'pro' && (
        <Card className={'flex items-center justify-center gap-4 p-4 py-8'}>
          <div className={'text-center'}>
            <div className={'text-foreground mb-2 text-2xl font-semibold'}>
              Upgrade Subscription to get more Auditory insights
            </div>
          </div>
          <ShieldEllipsis className={'my-4 size-20 text-orange-400'} />
          <Button variant={'default'} asChild>
            <Link to={'/account'}>Upgrade Subscription</Link>
          </Button>
          <div className={'mt-8 w-full px-4'}>
            <b>Business Plan</b> also provides access to:
            <Separator className={'my-2'} />
            <ul className={'text-muted-foreground'}>
              <li>Characters Examples</li>
              <li>What can make you unique?</li>
              <li>Channels of auditory attraction</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

// const AuditoryInfo = ({ project, auditory }: Props) => {
//   const hasInfo = auditory.menPercentage > 0;
//   if (!hasInfo) {
//     return <AuditoryInfoLoader project={project} auditory={auditory} />;
//   }
//
//   return <AuditoryInfoCard auditory={auditory} />;
// };
//
// const AuditoryDetails = ({ project, auditory }: Props) => {
//   const hasInfo = auditory.mainSegments.length > 0;
//   if (!hasInfo) {
//     return <AuditoryDetailsLoader project={project} auditory={auditory} />;
//   }
//
//   return <AuditoryDetailsCard auditory={auditory} />;
// };

// const AuditoryInfoLoader = ({ project }: Props) => {
//   const { state, reload } = useLoadableData(createAuditoryInfo, project.id);
//
//   switch (state.type) {
//     case 'loading':
//       return (
//         <div className={'flex flex-col gap-2'}>
//           <Skeleton className={'h-40 w-full'} />
//         </div>
//       );
//
//     case 'loaded':
//       return <AuditoryInfoCard auditory={state.data} />;
//
//     case 'error':
//       return (
//         <Card className={'flex flex-col items-center gap-2 py-4'}>
//           <p className={'text-xl text-red-700'}>Auditory Info loading error</p>
//           <p className={'pb-2'}>{state.error.message}</p>
//           <Button onClick={reload}>Try again</Button>
//         </Card>
//       );
//
//     default:
//       return notReachable(state);
//   }
// };

// const AuditoryDetailsLoader = ({ project }: Props) => {
//   const { state, reload } = useLoadableData(createAuditoryDetails, project.id);
//
//   switch (state.type) {
//     case 'loading':
//       return (
//         <div className={'flex flex-col gap-2'}>
//           <Skeleton className={'h-40 w-full'} />
//         </div>
//       );
//
//     case 'loaded':
//       return <AuditoryDetailsCard auditory={state.data} />;
//
//     case 'error':
//       return (
//         <Card className={'flex flex-col items-center gap-2 py-4'}>
//           <p className={'text-xl text-red-700'}>
//             Auditory Details loading error
//           </p>
//           <p className={'pb-2'}>{state.error.message}</p>
//           <Button onClick={reload}>Try again</Button>
//         </Card>
//       );
//
//     default:
//       return notReachable(state);
//   }
// };

const AuditoryInfoCard = ({ auditory }: { auditory: AuditoryBasicData }) => {
  return (
    <div className={'flex flex-col gap-2'}>
      {auditory.menPercentage && (
        <GenderCard menPercentage={auditory.menPercentage} />
      )}
      <AgeCard ageSeparation={auditory.ageSeparation} />

      <div className={'flex w-full flex-row flex-wrap gap-2'}>
        {auditory.tam && (
          <MarketCard
            value={auditory.tam}
            label="TAM"
            description="Total Addressable Market"
          />
        )}

        {auditory.sam && (
          <MarketCard
            value={auditory.sam}
            label="SAM"
            description="Serviceable Addressable Market"
          />
        )}

        {auditory.som && (
          <MarketCard
            value={auditory.som}
            label="SOM"
            description="Serviceable Obtainable Market"
          />
        )}
      </div>
    </div>
  );
};

const AuditoryDetailsCard = ({ auditory }: { auditory: AuditoryData }) => {
  return (
    <div className={'flex flex-col gap-8'}>
      {auditory.pro?.mainSegments.length && (
        <div className={'flex flex-col gap-4'}>
          <div className={'text-2xl font-semibold'}>Main Auditory Segments</div>
          <MainSegmentsList segments={auditory.pro.mainSegments} />
        </div>
      )}

      {auditory.business?.characters && (
        <div className={'flex flex-col gap-4'}>
          <div className={'text-2xl font-semibold'}>Characters Examples</div>
          <CharactersList characters={auditory.business.characters} />
        </div>
      )}

      {auditory.pro?.auditoryDemands && (
        <div className={'flex flex-col gap-4'}>
          <div className={'text-2xl font-semibold'}>What Auditory wants?</div>
          <MarkdownFormat>{auditory.pro.auditoryDemands}</MarkdownFormat>
        </div>
      )}

      {auditory.pro?.auditoryPains && (
        <div className={'flex flex-col gap-4'}>
          <div className={'text-2xl font-semibold'}>Auditory Pains</div>
          <MarkdownFormat>{auditory.pro.auditoryPains}</MarkdownFormat>
        </div>
      )}

      {auditory.business?.differentiation && (
        <div className={'flex flex-col gap-4'}>
          <div className={'text-2xl font-semibold'}>
            What can make you unique?
          </div>
          <MarkdownFormat>{auditory.business.differentiation}</MarkdownFormat>
        </div>
      )}

      {auditory.business?.auditoryChannels && (
        <div className={'flex flex-col gap-4'}>
          <div className={'text-2xl font-semibold'}>
            Channels of auditory attraction
          </div>
          <MarkdownFormat>{auditory.business.auditoryChannels}</MarkdownFormat>
        </div>
      )}
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
