import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import { PhaseEntity } from '@/modules/phases/types/entity';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { ChartConfig, ChartContainer } from '@/ui/chart';

const chartConfig = {
  day: {
    label: 'Day',
    color: 'var(--chart-1)',
  },
  label: {
    color: 'var(--background)',
  },
} satisfies ChartConfig;

export function PhasesTimeline({ phases }: { phases: PhaseEntity[] }) {
  if (phases.length === 0) {
    return null;
  }

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
          Estimation {endOfTimeline} calendar days
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
