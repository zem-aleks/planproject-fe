import { useNavigate } from 'react-router';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import { PhaseCard } from '@/modules/phases/components/PhaseCard';
import { PhasesLoader } from '@/modules/phases/components/PhasesLoader';
import { PhaseEntity } from '@/modules/phases/types/entity';
import { ProjectEntity } from '@/modules/projects/types/entity';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { ChartConfig, ChartContainer } from '@/ui/chart';
import { notReachable } from '@/utils/notReachable';

export const PhasesBlock = ({ project }: { project: ProjectEntity }) => {
  const navigate = useNavigate();
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xl font-semibold'}>Project Phases</div>
      <PhasesLoader projectId={project.id}>
        {(phases, reload) => (
          <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2'}>
              {phases.map((phase, index) => (
                <PhaseCard
                  phase={phase}
                  index={index + 1}
                  key={phase.id}
                  onMsg={(msg) => {
                    switch (msg.type) {
                      case 'onPhaseUpdated':
                        reload();
                        break;

                      case 'onOpenClicked':
                        navigate(`/project/${project.id}/phase/${phase.id}`);
                        break;

                      default:
                        return notReachable(msg);
                    }
                  }}
                />
              ))}
            </div>
            <ChartBarHorizontal phases={phases} />
          </div>
        )}
      </PhasesLoader>
    </div>
  );
};

const chartConfig = {
  day: {
    label: 'Day',
    color: 'var(--chart-1)',
  },
  label: {
    color: 'var(--background)',
  },
} satisfies ChartConfig;

export function ChartBarHorizontal({ phases }: { phases: PhaseEntity[] }) {
  const chartData = phases.map((phase) => {
    return {
      title: phase.title,
      startDay: phase.timelineStartDay,
      endDay: phase.timelineEndDay,
      duration: phase.timelineEndDay - phase.timelineStartDay,
    };
  });

  const endOfTimeline = Math.max(...phases.map((p) => p.timelineEndDay), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline (avg)</CardTitle>
        <CardDescription>
          Estimation {endOfTimeline} working days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} />

            <XAxis
              type="number"
              interval={'equidistantPreserveStart'}
              axisLine={true}
              tickLine={true}
              unit={'days'}
              domain={[0, endOfTimeline + 10]} // adjust max to fit your data
              tickCount={endOfTimeline}
            />
            <YAxis
              dataKey="title"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              hide
            />
            <Bar
              dataKey={({ startDay, endDay }) => [startDay, endDay]}
              fill="#10b981"
              radius={5}
            >
              <LabelList
                dataKey="duration"
                position="inside"
                formatter={(v) => `${v} days`}
                className="fill-[var(--background)]"
                fontSize={12}
              />
              <LabelList
                dataKey="title"
                position="right"
                offset={8}
                className="fill-[#000]"
                fontSize={14}
                style={{ height: '30px' }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
