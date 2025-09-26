import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import {
  AudioQueueContext,
  AudioTrackState,
  AudioTrackStateLoaded,
  AudioTrackStateToBeLoaded,
} from '@/modules/tts/contexts/AudioQueueContext.tsx';
import { LoadAudioResult, loadAudio } from '@/modules/tts/helpers/loadAudio.ts';
import { notReachable } from '@/utils/notReachable';

let id = 100;

export const AudioQueueController = ({
  audioContext,
  children,
}: {
  audioContext: AudioContext;
  children: ReactNode;
}) => {
  const [volume, setVolume] = useState(1);
  const [queue, setQueue] = useState<AudioTrackState[]>([]);
  const queueRef = useRef(queue);
  const isPreloadingRef = useRef(false);
  queueRef.current = queue;

  // Desctuctor was closing context before actual exit and caused issues
  // useEffect(() => {
  //   return () => {
  //     console.log('Call to close the context. ', audioContext.state);
  //     if (audioContext.state !== 'closed') {
  //       audioContext.close();
  //     }
  //   };
  // }, [audioContext]);

  // console.log(queue);

  const onAudioLoaded = useCallback(
    (loadAudioResult: LoadAudioResult, item: AudioTrackStateToBeLoaded) => {
      const currentQueue = queueRef.current;
      const queueOnChange: AudioTrackState[] = currentQueue.map(
        (currentItem) => {
          if (currentItem.id === item.id) {
            switch (loadAudioResult.type) {
              case 'error':
                return {
                  ...currentItem,
                  audioUrl: item.audioUrl,
                  type: 'error',
                  error: loadAudioResult.error,
                };

              case 'success':
                return {
                  ...currentItem,
                  type: 'loaded',
                  sourceNode: loadAudioResult.sourceNode,
                  gainNode: loadAudioResult.gainNode,
                };

              default:
                return notReachable(loadAudioResult);
            }
          }
          return currentItem;
        },
      );
      setQueue(queueOnChange);
      queueRef.current = queueOnChange;
    },
    [],
  );

  const playLoadedItem = useCallback(
    (item: AudioTrackStateLoaded) => {
      item.sourceNode.onended = () => {
        const currentQueue = queueRef.current;
        const queueOnChange: AudioTrackState[] = currentQueue.filter(
          (newItem) => newItem.id !== item.id,
        );

        if (item.onEnd) item.onEnd();
        setQueue(queueOnChange);
      };
      item.sourceNode.start(0);
      console.log('playing new with volume: ', volume);
      item.gainNode.gain.value = volume;
      if (item.onStart) item.onStart();

      const currentQueue = queueRef.current;
      setQueue(
        currentQueue.map((newItem) =>
          newItem.id === item.id ? { ...newItem, type: 'playing' } : newItem,
        ) as AudioTrackState[],
      );
    },
    [volume],
  );

  // loading of new items
  useEffect(() => {
    const currentQueue = queueRef.current;
    if (!currentQueue.some((item) => item.type === 'toBeLoaded')) {
      return;
    }

    const newQueue: AudioTrackState[] = currentQueue.map((item) => {
      if (item.type === 'toBeLoaded') {
        loadAudio(item.audioUrl, audioContext).then((res) =>
          onAudioLoaded(res, item),
        );
        return { ...item, type: 'loading' };
      }

      return item;
    });

    setQueue(newQueue);
  }, [audioContext, onAudioLoaded, queue]);

  useEffect(() => {
    queue.forEach((item, index) => {
      switch (item.type) {
        case 'toBeLoaded':
          break;

        case 'playing':
        case 'loading':
          break;

        case 'error':
          console.log('Error at item: ', item);
          break;

        case 'loaded':
          // we can start playing only if a first item in a queue was loaded
          if (index !== 0) {
            return;
          }

          if (!isPreloadingRef.current) {
            playLoadedItem(item);
          }
          break;

        default:
          return notReachable(item);
      }
    });
  }, [audioContext, onAudioLoaded, playLoadedItem, queue]);

  const play = useCallback(
    (
      audioUrl: string,
      speed: number,
      onStart: () => void,
      onEnd: () => void,
    ) => {
      const currentQueue = queueRef.current;
      const newQueue: AudioTrackState[] = [
        ...currentQueue,
        { type: 'toBeLoaded', audioUrl, id: ++id, speed, onStart, onEnd },
      ];
      setQueue(newQueue);
      queueRef.current = newQueue;

      return Promise.resolve();
    },
    [],
  );

  const playMany = useCallback((audioUrls: string[], speed: number) => {
    const currentQueue = queueRef.current;

    const newItems: AudioTrackStateToBeLoaded[] = audioUrls.map((audioUrl) => ({
      type: 'toBeLoaded',
      audioUrl,
      id: ++id,
      speed,
    }));

    setQueue([...currentQueue, ...newItems]);
    queueRef.current = [...currentQueue, ...newItems];
  }, []);

  const stop = useCallback(() => {
    const currentQueue = queueRef.current;
    currentQueue.forEach((item) => {
      if (item.type === 'playing') {
        try {
          item.sourceNode.stop();
        } catch (error) {
          console.log(error);
        }
      }
    });
    setQueue([]);
    // new items can appear during the stop and update will be lost
    queueRef.current = [];
    isPreloadingRef.current = false;
  }, []);

  const enablePreloading = useCallback(() => {
    const currentQueue = queueRef.current;
    if (currentQueue.length > 0) {
      console.error('Queue is not empty!!!');
      return;
    }

    isPreloadingRef.current = true;
  }, []);

  const disablePreloadingAndPlay = useCallback(() => {
    isPreloadingRef.current = false;
    const currentQueue = queueRef.current;
    currentQueue.forEach((item, index) => {
      switch (item.type) {
        case 'toBeLoaded':
        case 'loading':
        case 'playing':
        case 'error':
          break;

        case 'loaded':
          // we can start playing only if a first item in a queue was loaded
          if (index === 0) {
            playLoadedItem(item);
          }
          break;

        default:
          return notReachable(item);
      }
    });
  }, [playLoadedItem]);

  const setVolumeAction = useCallback((newVolume: number) => {
    setVolume(newVolume);
    const currentQueue = queueRef.current;
    currentQueue.forEach((item) => {
      if (item.type === 'playing') {
        item.gainNode.gain.value = newVolume;
      }
    });
  }, []);

  // const queueErrors = queue.filter((item) => item.type === 'error') as AudioTrackStateError[];

  return (
    <AudioQueueContext.Provider
      value={{
        play: (
          src: string,
          speed: number,
          onStart: () => void,
          onEnd: () => void,
        ) => play(src, speed, onStart, onEnd),
        playMany,
        stop,
        queue,
        enablePreloading,
        disablePreloadingAndPlay,
        setVolume: setVolumeAction,
      }}
    >
      {children}
    </AudioQueueContext.Provider>
  );
};
