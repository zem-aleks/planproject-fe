import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { useAuthSession } from '@/modules/auth/contexts/AuthSessionContext';
import { addStartShapingUserMessage } from '@/modules/shaping/api/addStartShapingUserMessage';
import { ShapingEntity } from '@/modules/shaping/types/entity';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { Textarea } from '@/ui/textarea';
import { notReachable } from '@/utils/notReachable';
import { useLazyLoadableData } from '@/utils/useLazyLoadableData';

export type Msg =
  | { type: 'onAccepted'; shaping: ShapingEntity }
  | { type: 'onUpdate'; shaping: ShapingEntity };

export const SummaryReview = ({
  shaping,
  onMsg,
}: {
  shaping: ShapingEntity;
  onMsg: (msg: Msg) => void;
}) => {
  const [modify, setModify] = useState<boolean>(false);

  if (modify) {
    return (
      <ModifySummary
        shaping={shaping}
        onMsg={(msg) => {
          switch (msg.type) {
            case 'onBack':
              setModify(false);
              break;

            case 'onUpdate':
              onMsg(msg);
              setModify(false);
              break;

            default:
              return notReachable(msg);
          }
        }}
      />
    );
  }

  return (
    <div
      className={'relative flex min-h-full w-full flex-col gap-2 p-4 md:gap-4'}
    >
      <div className={'py-2 text-lg font-semibold md:text-3xl'}>
        Please review the summary
      </div>
      <Card className={'grow overflow-y-auto bg-gray-50 p-2 px-4'}>
        <div>
          <MarkdownFormat>{shaping.summary}</MarkdownFormat>
        </div>
      </Card>

      <div className={'flex w-full flex-wrap justify-end gap-4'}>
        <div
          className={
            'flex w-full flex-col items-center gap-2 md:w-auto md:flex-row'
          }
        >
          <div className={'text-muted-foreground'}>
            *You can add more details or modify the existing data
          </div>
          <Button
            className={'w-full px-12 md:w-auto'}
            onClick={() => setModify(true)}
          >
            Modify
          </Button>
        </div>
        <Button
          className={'w-full bg-green-600 px-12 md:w-auto'}
          onClick={() => onMsg({ type: 'onAccepted', shaping })}
        >
          Correct
        </Button>
      </div>
    </div>
  );
};

type ModifySummaryMsg =
  | { type: 'onBack' }
  | { type: 'onUpdate'; shaping: ShapingEntity };

export const ModifySummary = ({
  shaping,
  onMsg,
}: {
  shaping: ShapingEntity;
  onMsg: (msg: ModifySummaryMsg) => void;
}) => {
  const { clientId } = useAuthSession();
  const { state, load } = useLazyLoadableData(addStartShapingUserMessage);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    switch (state.type) {
      case 'not_requested':
      case 'loading':
        break;

      case 'error':
        toast.error(
          `Failed to submit: ${state.error.response?.data.message || state.error.message}`,
        );
        break;

      case 'loaded':
        setMessage('');
        onMsg({ type: 'onUpdate', shaping: state.data });
        break;

      default:
        return notReachable(state);
    }
  }, [state]);

  return (
    <div
      className={'relative flex min-h-full w-full flex-col gap-2 p-4 md:gap-4'}
    >
      <div className={'py-2 text-lg font-semibold md:text-3xl'}>
        Provide additional context
      </div>
      <Card className={'overflow-y-auto bg-gray-50 p-2 px-4'}>
        <div>
          <MarkdownFormat>{shaping.improvements}</MarkdownFormat>
        </div>
      </Card>

      <Textarea
        id="description"
        placeholder="Enter your answer"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={8}
        required={true}
        disabled={state.type === 'loading'}
        className={'w-full grow'}
        maxLength={4000}
      />

      <div className={'flex w-full flex-wrap justify-end gap-4'}>
        <Button
          className={'w-full px-12 md:w-auto'}
          onClick={() => onMsg({ type: 'onBack' })}
          disabled={state.type === 'loading'}
        >
          Back
        </Button>
        <Button
          className={'w-full bg-green-600 px-12 md:w-auto'}
          onClick={() => load({ shapingId: shaping.id, message, clientId })}
          loading={state.type === 'loading'}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
