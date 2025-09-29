import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

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

export const PhasesBlock = ({ project }: { project: ProjectEntity }) => {
  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'text-xl font-semibold'}>Project Phases</div>
      <PhasesLoader projectId={project.id}>
        {(phases) => (
          <div className={'flex flex-col gap-4'}>
            <PhasesList phases={phases} />
            <ChartBarHorizontal phases={phases} />
          </div>
        )}
      </PhasesLoader>
    </div>
  );
};

const PhasesList = ({ phases }: { phases: PhaseEntity[] }) => {
  return (
    <div className={'flex flex-col gap-2'}>
      {phases.map((phase, index) => (
        <div key={phase.id} className={'rounded border p-2'}>
          <div className={'text-lg font-semibold'}>
            {index + 1}. {phase.title}
          </div>
          <div className={'text-muted-foreground'}>{phase.description}</div>
          <div className={'text-sm'}>
            Estimation: {phase.minDaysNeeded} - {phase.maxDaysNeeded} days
          </div>
          <div className={'text-sm'}>
            Expertise needed: {phase.expertiseNeeded}
          </div>
        </div>
      ))}
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
  const minDays = phases.reduce((sum, phase) => sum + phase.minDaysNeeded, 0);
  const maxDays = phases.reduce((sum, phase) => sum + phase.maxDaysNeeded, 0);
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
          Total estimation {minDays} - {maxDays} days (without overlapping)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 10 }}
          >
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
