import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { toggleStep } from '@/modules/milestones/api/toggleStep';
import {
  MilestoneEntity,
  MilestoneStep,
} from '@/modules/milestones/types/entity';
import { Checkbox } from '@/ui/checkbox';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export const MilestoneStepsList = ({
  milestone,
  onUpdated,
}: {
  milestone: MilestoneEntity;
  onUpdated: (milestone: MilestoneEntity) => void;
}) => {
  const { load, state, reset } = useLazyLoadableData(toggleStep);
  const [togglingStepId, setTogglingStepId] = useState<string | null>(null);

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'loaded':
        onUpdated(state.data);
        setTogglingStepId(null);
        reset();
        break;

      case 'error':
        toast.error(
          `Failed to toggle step: ${state.error.response?.data.message || state.error.message}`,
        );
        setTogglingStepId(null);
        reset();
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  const handleToggle = (stepId: string) => {
    setTogglingStepId(stepId);
    load({ milestoneId: milestone.id, stepId });
  };

  const completedCount = milestone.steps.filter((s) => s.completed).length;

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex items-center justify-between'}>
        <div className={'font-semibold'}>Steps:</div>
        <div className={'text-muted-foreground text-sm'}>
          {completedCount}/{milestone.steps.length} completed
        </div>
      </div>

      <div className={'flex flex-col gap-1'}>
        {milestone.steps.map((step) => (
          <StepItem
            key={step.id}
            step={step}
            disabled={togglingStepId !== null}
            loading={togglingStepId === step.id}
            onToggle={() => handleToggle(step.id)}
          />
        ))}
      </div>
    </div>
  );
};

const StepItem = ({
  step,
  disabled,
  loading,
  onToggle,
}: {
  step: MilestoneStep;
  disabled: boolean;
  loading: boolean;
  onToggle: () => void;
}) => {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
        step.completed
          ? 'border-green-600/30 bg-green-600/10'
          : 'border-border bg-card'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-accent/50'}`}
    >
      <Checkbox
        checked={step.completed}
        onCheckedChange={onToggle}
        disabled={disabled}
        className={'mt-0.5'}
      />
      <div className={'flex flex-col gap-0.5'}>
        <span
          className={`text-sm font-medium ${step.completed ? 'text-muted-foreground line-through' : ''}`}
        >
          {step.title}
        </span>
        {step.description && (
          <span className={'text-muted-foreground text-xs'}>
            {step.description}
          </span>
        )}
      </div>
      {loading && (
        <div className={'ml-auto self-center'}>
          <div
            className={
              'border-primary size-4 animate-spin rounded-full border-2 border-t-transparent'
            }
          />
        </div>
      )}
    </label>
  );
};
