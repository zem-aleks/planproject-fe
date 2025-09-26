export type LoadAudioResult =
  | { type: 'error'; error: string }
  | { type: 'success'; sourceNode: AudioBufferSourceNode; gainNode: GainNode };

export const loadAudio = async (
  audioUrl: string,
  audioContext: AudioContext,
): Promise<LoadAudioResult> => {
  try {
    // console.log(audioUrl, 'loading started');
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    // console.log(audioUrl, 'loading finished');
    if (!audioBuffer) {
      return { type: 'error', error: 'no audio buffer' };
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    const gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    return { type: 'success', sourceNode: source, gainNode };
  } catch (error) {
    console.error('Error fetching or playing audio:', error);
    return { type: 'error', error: `${error}` };
  }
};
