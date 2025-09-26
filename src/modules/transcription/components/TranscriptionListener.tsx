import { ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { initTranscriptionRealtime } from '@/modules/transcription/utils/initTranscriptionRealtime.ts';
import { notReachable } from '@/utils/notReachable.ts';
import { useLoadableData } from '@/utils/useLoadableData.ts';

type Msg =
  | { type: 'onSessionStarted' }
  | { type: 'onSpeechStarted'; itemId: string }
  | { type: 'onSpeechFinished'; itemId: string }
  | { type: 'onTranscriptionCompleted'; itemId: string; transcription: string };

type Props = {
  mediaStream: MediaStream;
  threshold: number;
  onMsg: (msg: Msg) => void;
};

export const TranscriptionListener = ({
  mediaStream,
  threshold,
  onMsg,
}: Props): ReactNode => {
  const { t } = useTranslation();
  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data);
    // console.log(data);
    switch (data.type) {
      case 'transcription_session.created':
        onMsg({ type: 'onSessionStarted' });
        break;

      case 'input_audio_buffer.speech_started':
        onMsg({ type: 'onSpeechStarted', itemId: data.item_id });
        console.log('Started new speech', data.item_id);
        break;

      case 'input_audio_buffer.committed':
        onMsg({ type: 'onSpeechFinished', itemId: data.item_id });
        break;

      // case 'conversation.item.created':
      //   console.log('Conversation item created:', data.item.id);
      //   break;

      case 'conversation.item.input_audio_transcription.completed': {
        onMsg({
          type: 'onTranscriptionCompleted',
          transcription: data.transcript,
          itemId: data.item_id,
        });
        console.log('Transcription completed:', data.transcript);
        break;
      }
    }
    // It's intended
    // eslint-disable-next-line
  }, []);
  const { state, reload } = useLoadableData(initTranscriptionRealtime, {
    mediaStream,
    onMessage: handleMessage,
    threshold,
  });

  switch (state.type) {
    case 'loading':
    case 'loaded':
      return null;

    case 'error':
      return (
        <div>
          <p>
            {t('common.errorPlaceholder')}: {state.error.message}
          </p>
          <button onClick={reload}>{t('common.retryLoading')}</button>
        </div>
      );

    default:
      return notReachable(state);
  }
};
