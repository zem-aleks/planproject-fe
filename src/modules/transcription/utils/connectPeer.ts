export const connectPeer = (mediaStream: MediaStream) => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  // Connecting AUDIO to WebRTC
  // const audioElement = createAudioElement();
  // const onRtcTrackEvent = (e: RTCTrackEvent) => {
  //   audioElement.srcObject = e.streams[0];
  // };
  // pc.addEventListener('track', onRtcTrackEvent);

  // Connecting microphone to WebRTC
  mediaStream
    .getAudioTracks()
    .forEach((track) => pc.addTrack(track, mediaStream));

  const disconnect = () => {
    // pc.removeEventListener('track', onRtcTrackEvent);
    pc.close();
    mediaStream.getTracks().forEach((track) => track.stop());
    // audioElement.srcObject = null;
  };

  return {
    peerConnection: pc,
    // audioElement,
    disconnect,
  };
};
