import * as React from 'react';
import type { ReactNode } from 'react';

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
    color: '#ad46ff',
  },
  label: {
    color: 'var(--background)',
  },
} satisfies ChartConfig;

export const PhasesTimeline = React.memo(
  ({ phases }: { phases: PhaseEntity[] }) => {
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
    const rowHeight = 70;
    const chartHeight = Math.max(300, phases.length * rowHeight + 40);

    return (
      <Card className={'py-4'}>
        <CardHeader>
          <CardTitle>Project Timeline (avg)</CardTitle>
          <CardDescription>
            Estimation {endOfTimeline} calendar days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className={'aspect-auto w-full'}
            style={{ height: `${chartHeight}px` }}
          >
            <BarChart accessibilityLayer data={chartData} layout="vertical">
              <CartesianGrid horizontal={false} />

              <XAxis
                type="number"
                interval={'equidistantPreserveStart'}
                axisLine={true}
                tickLine={true}
                unit={'days'}
                domain={[0, endOfTimeline + 10]}
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
                fill="#ad46ff99"
                radius={5}
                barSize={24}
              >
                <LabelList
                  dataKey="duration"
                  position="inside"
                  formatter={(v: ReactNode) => `${v} days`}
                  className="fill-[var(--background)]"
                  fontSize={12}
                />
                <LabelList
                  dataKey="title"
                  position="top"
                  offset={6}
                  className="fill-foreground"
                  fontSize={13}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.phases.length === nextProps.phases.length;
  },
);
