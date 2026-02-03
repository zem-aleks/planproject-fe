import { useState } from 'react';

import { SummarizePublicShapingForm } from '@/modules/shaping/components/SummarizePublicShapingForm';
import { SummaryReview } from '@/modules/shaping/components/SummaryReview';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { notReachable } from '@/utils/notReachable';

type Msg = { type: 'onAccepted' };

export const ShapingSummary = (props: {
  shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const [shaping, setShaping] = useState<ShapingEntity>(props.shaping);
  const hasSummary = shaping.summary !== null;

  if (hasSummary) {
    return (
      <SummaryReview
        shaping={shaping}
        onMsg={(msg) => {
          switch (msg.type) {
            case 'onAccepted':
              props.onMsg({ type: 'onAccepted' });
              break;

            case 'onUpdate':
              setShaping(msg.shaping);
              break;

            default:
              return notReachable(msg);
          }
        }}
      />
    );
  }

  return (
    <SummarizePublicShapingForm
      shaping={shaping}
      onMsg={(msg) => {
        switch (msg.type) {
          case 'onFinish':
            setShaping(msg.shaping);
            break;

          default:
            return notReachable(msg.type);
        }
      }}
    />
  );
};
