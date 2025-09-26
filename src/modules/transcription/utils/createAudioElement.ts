export const createAudioElement = (): HTMLAudioElement => {
  const audioElement = Object.assign(document.createElement('audio'), {
    autoplay: true,
  });
  document.body.appendChild(audioElement);

  return audioElement;
};
