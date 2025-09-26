import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TranscriptionListener } from '@/modules/transcription/components/TranscriptionListener.tsx';
import { notReachable } from '@/utils/notReachable.ts';

type Msg =
  | { type: 'onUserMessageAdded'; content: string }
  | { type: 'onNewSpeechStarted'; itemId: string };

type TranscriptionStatus =
  | { type: 'idle' }
  | { type: 'listening' }
  | { type: 'transcribing' }
  | { type: 'transcripted'; transcription: string };

type State =
  | { type: 'loading' }
  | { type: 'active'; status: TranscriptionStatus };

type Props = {
  threshold: number;
  mediaStream: MediaStream;
  onMsg: (msg: Msg) => void;
};

export const TranscriptionState = ({
  mediaStream,
  threshold,
  onMsg,
}: Props): ReactNode => {
  const { t } = useTranslation();
  const [state, setState] = useState<State>({ type: 'loading' });

  return (
    <div className={'flex flex-col'}>
      <h1 className="text-4xl font-bold tracking-tighter">
        {t('transcription.state')}
      </h1>
      <TranscriptionStatus state={state} />
      <TranscriptionListener
        mediaStream={mediaStream}
        threshold={threshold}
        onMsg={(msg) => {
          switch (msg.type) {
            case 'onSpeechStarted':
              setState({ type: 'active', status: { type: 'listening' } });
              onMsg({ type: 'onNewSpeechStarted', itemId: msg.itemId });
              break;

            case 'onSpeechFinished':
              console.time('transcription.time');
              setState({ type: 'active', status: { type: 'transcribing' } });
              break;

            case 'onTranscriptionCompleted':
              console.timeEnd('transcription.time');
              setState({
                type: 'active',
                status: {
                  type: 'transcripted',
                  transcription: msg.transcription,
                },
              });
              onMsg({ type: 'onUserMessageAdded', content: msg.transcription });
              break;

            case 'onSessionStarted':
              setState({ type: 'active', status: { type: 'idle' } });
              break;

            default:
              return notReachable(msg);
          }
        }}
      />
    </div>
  );
};

const TranscriptionStatus = ({ state }: { state: State }) => {
  const { t } = useTranslation();
  switch (state.type) {
    case 'loading':
      return <div>{t('common.loadingInProgress')}</div>;

    case 'active': {
      switch (state.status.type) {
        case 'idle':
          return <div>{t('transcription.whatYouWant')}</div>;

        case 'listening':
          return <div>{t('transcription.listening')}</div>;

        case 'transcribing':
          return <div>{t('transcription.thinking')}</div>;

        case 'transcripted':
          return (
            <div>
              {t('transcription.whatWasSaid')}: {state.status.transcription}
            </div>
          );

        default:
          return notReachable(state.status);
      }
    }

    default:
      return notReachable(state);
  }
};
