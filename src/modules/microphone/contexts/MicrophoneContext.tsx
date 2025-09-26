import { ReactNode, createContext, useEffect } from 'react';

import { toast } from 'sonner';

import { useMicrophoneConnector } from '@/modules/microphone/components/MicrophoneConnector.tsx';
import { Button } from '@/ui/button.tsx';
import { LoadableData } from '@/utils/useLoadableData.ts';

type MicrophoneContextData = {
  state: LoadableData<MediaStream, void, DOMException | unknown>;
  reconnectMicrophone: () => void;
};

const emptyContextValue: MicrophoneContextData = {
  state: {},
  reconnectMicrophone: () => {},
} as MicrophoneContextData;

export const MicrophoneContext =
  createContext<MicrophoneContextData>(emptyContextValue);

export const MicrophoneContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { state, reload } = useMicrophoneConnector();

  useEffect(() => {
    if (state.type === 'error') {
      toast.error(`Microphone connection error: ${state.error.message}`, {
        closeButton: true,
        action: <Button onClick={reload}>Reconnect</Button>,
        duration: 5000,
      });
    }
  }, [reload, state]);

  return (
    <>
      <MicrophoneContext.Provider
        value={{
          state,
          reconnectMicrophone: reload,
        }}
      >
        {children}
      </MicrophoneContext.Provider>
    </>
  );
};
