import { ReactNode, Ref, forwardRef, useImperativeHandle } from 'react';

import { connectMicrophone } from '@/modules/transcription/utils/connectMicrophone.ts';
import { notReachable } from '@/utils/notReachable.ts';
import { LoadableData, useLoadableData } from '@/utils/useLoadableData.ts';

export type MicrophoneConnectorRef = {
  state: LoadableData<MediaStream, void, DOMException | unknown>;
  reconnectMicrophone: () => void;
};

type Props = {
  children?: (mediaStream: MediaStream) => ReactNode;
  ref: Ref<MicrophoneConnectorRef>;
};

//  If the user denies permission, or matching media is not available, then the promise is rejected with NotAllowedError or NotFoundError DOMException  respectively.
const connect = () => {
  try {
    return connectMicrophone();
  } catch (error: unknown) {
    if (error instanceof DOMException) {
      // here err.name is "NotAllowedError" | "NotFoundError" | "NotReadableError" | …
      console.error('getUserMedia failed:', error.name, error.message);
      // you can re-throw or map to your own error type
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
};

export const MicrophoneConnector = forwardRef<MicrophoneConnectorRef, Props>(
  ({ children }, ref) => {
    const { state, reload } = useLoadableData(connect, undefined);
    useImperativeHandle(
      ref,
      (): MicrophoneConnectorRef => ({
        state,
        reconnectMicrophone: reload,
      }),
      [state, reload],
    );

    if (!children) {
      return null;
    }

    switch (state.type) {
      case 'loading':
      case 'error':
        return null;

      case 'loaded':
        return <>{children(state.data)}</>;

      default:
        return notReachable(state);
    }
  },
);

export const useMicrophoneConnector = () => {
  return useLoadableData(connect, undefined);
};
