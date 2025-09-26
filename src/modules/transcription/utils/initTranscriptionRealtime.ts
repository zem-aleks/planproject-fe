import { getTranscriptionSession } from '@/modules/transcription/api/getTranscriptionSession.ts';

// TODO: add destructor
export const initTranscriptionRealtime = async ({
  mediaStream,
  threshold,
  onMessage,
}: {
  mediaStream: MediaStream;
  threshold: number;
  onMessage: (e: MessageEvent) => void;
}) => {
  // Get an ephemeral key from your server - see server code below
  const tokenResponse = await getTranscriptionSession({ threshold });
  const EPHEMERAL_KEY = tokenResponse.client_secret.value;

  // Create a peer connection
  const pc = new RTCPeerConnection();

  // Add local audio track for microphone input in the browser
  pc.addTrack(mediaStream.getTracks()[0]);

  // Set up data channel for sending and receiving events
  const dc = pc.createDataChannel('oai-events');
  dc.addEventListener('message', onMessage);

  // Start the session using the Session Description Protocol (SDP)
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const baseUrl = 'https://api.openai.com/v1/realtime?intent=transcription';
  const sdpResponse = await fetch(baseUrl, {
    method: 'POST',
    body: offer.sdp,
    headers: {
      Authorization: `Bearer ${EPHEMERAL_KEY}`,
      'Content-Type': 'application/sdp',
    },
  });

  const answer = {
    type: 'answer',
    sdp: await sdpResponse.text(),
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await pc.setRemoteDescription(answer);
};
