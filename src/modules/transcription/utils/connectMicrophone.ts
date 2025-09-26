export const connectMicrophone = async () => {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      sampleRate: 24_000,
      echoCancellation: true,
      noiseSuppression: true,
      // autoGainControl: false,
    },
  });
};
