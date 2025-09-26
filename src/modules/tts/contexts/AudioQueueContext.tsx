import { ReactNode, createContext, useState } from 'react';

import { AudioQueueController } from '@/modules/tts/contexts/AudioQueueController.tsx';
import { noOperation, notReachable } from '@/utils/notReachable';

export type AudioTrackStateError = {
  type: 'error';
  audioUrl: string;
  error: string;
  id: number;
  speed: number;
  onStart?: () => void;
  onEnd?: () => void;
};

export type AudioTrackStateToBeLoaded = {
  type: 'toBeLoaded';
  audioUrl: string;
  id: number;
  speed: number;
  onStart?: () => void;
  onEnd?: () => void;
};

export type AudioTrackStateLoaded = {
  type: 'loaded';
  sourceNode: AudioBufferSourceNode;
  gainNode: GainNode;
  id: number;
  speed: number;
  duration?: number;
  onStart?: () => void;
  onEnd?: () => void;
};

export type AudioTrackState =
  | AudioTrackStateToBeLoaded
  | { type: 'loading'; audioUrl: string; id: number; speed: number }
  | AudioTrackStateLoaded
  | {
      type: 'playing';
      sourceNode: AudioBufferSourceNode;
      gainNode: GainNode;
      id: number;
      duration?: number;
      speed: number;
    }
  | AudioTrackStateError;

type State =
  | { type: 'active'; audioContext: AudioContext }
  | { type: 'error'; error: string };

const getInitialState = (): State => {
  const audioContext = new (window.AudioContext ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window.webkitAudioContext)();

  if (!audioContext) {
    return { type: 'error', error: 'No audio context available!' };
  }

  return { type: 'active', audioContext };
};

type AudioContextData = {
  play: (
    src: string,
    speed: number,
    onStart: () => void,
    onEnd: () => void,
  ) => Promise<void>;
  playMany: (audioUrls: string[], speed: number) => void;
  stop: () => void;
  queue: AudioTrackState[];
  disablePreloadingAndPlay: () => void;
  enablePreloading: () => void;
  setVolume: (volume: number) => void;
};

const emptyContextValue: AudioContextData = {
  play: () => Promise.resolve(),
  playMany: noOperation,
  stop: noOperation,
  queue: [],
  disablePreloadingAndPlay: noOperation,
  enablePreloading: noOperation,
  setVolume: noOperation,
};

export const AudioQueueContext =
  createContext<AudioContextData>(emptyContextValue);

export const AudioQueueContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state] = useState<State>(getInitialState());

  switch (state.type) {
    case 'error':
      return (
        <AudioQueueContext.Provider value={emptyContextValue}>
          {children}
        </AudioQueueContext.Provider>
      );

    case 'active':
      return (
        <AudioQueueController audioContext={state.audioContext}>
          {children}
        </AudioQueueController>
      );

    default:
      return notReachable(state);
  }
};
