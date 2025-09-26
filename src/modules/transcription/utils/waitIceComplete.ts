export const waitIceComplete = async (peerConnection: RTCPeerConnection) => {
  const offer = await peerConnection.createOffer(); // { offerToReceiveAudio: true }
  await peerConnection.setLocalDescription(offer);
  await waitIceComplete(peerConnection);
};
