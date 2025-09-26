import { getTranscriptionSession } from '@/modules/transcription/api/getTranscriptionSession.ts';
import { connectMicrophone } from '@/modules/transcription/utils/connectMicrophone.ts';

type Data = { ephemeralToken: string; mediaStream: MediaStream };

export const load = (threshold: number): Promise<Data> =>
  Promise.all([
    getTranscriptionSession({ threshold }),
    connectMicrophone(),
  ]).then(([session, mediaStream]) => {
    return {
      ephemeralToken: session.client_secret.value,
      mediaStream,
    };
  });
//
// export const TranscriptionLoader = () => {
//   const { t } = useTranslation();
//   const { state, reload } = useLoadableData(load, undefined);
//
//   const onMessage = useCallback((event: Event) => {
//     console.log('Received message:', event);
//   }, []);
//
//   switch (state.type) {
//     case 'loading':
//       return <div>{t('common.loadingPlaceholders')}</div>;
//
//     case 'loaded':
//       return (
//         <PeerConnector
//           mediaStream={state.data.mediaStream}
//           ephemeralToken={state.data.ephemeralToken}
//           onMessage={onMessage}
//         />
//       );
//
//     case 'error':
//       return (
//         <div>
//           <p>
//             {t('common.errorPlaceholder')}: {state.error.message}
//           </p>
//           <button onClick={reload}>{t('common.retryLoading')}</button>
//         </div>
//       );
//
//     default:
//       return notReachable(state);
//   }
// };
//
// const PeerConnector = ({
//   mediaStream,
//   onMessage,
// }: Data & { onMessage: (event: Event) => void }) => {
//   const { t } = useTranslation();
//   const [peerConnection, setPeerConnection] =
//     useState<RTCPeerConnection | null>(null);
//
//   useEffect(() => {
//     const { peerConnection, disconnect } = connectPeer(mediaStream);
//     peerConnection.addEventListener('message', onMessage);
//     setPeerConnection(peerConnection);
//
//     return () => {
//       peerConnection.removeEventListener('message', onMessage);
//       disconnect();
//     };
//   }, [mediaStream, onMessage]);
//
//   if (!peerConnection) {
//     return <div>{t('common.connecting')}</div>;
//   }
//
//   return <IceLoader peerConnection={peerConnection} />;
// };
//
// const IceLoader = ({
//   peerConnection,
// }: {
//   peerConnection: RTCPeerConnection;
// }) => {
//   const { t } = useTranslation();
//   const { state, reload } = useLoadableData(waitIceComplete, peerConnection);
//
//   switch (state.type) {
//     case 'loading':
//       return <div>{t('common.loadingPlaceholders')}</div>;
//
//     case 'loaded':
//       return <div>{t('transcription.loadedPlaceholder')}</div>;
//
//     case 'error':
//       return (
//         <div>
//           <p>
//             {t('common.errorPlaceholder')}: {state.error.message}
//           </p>
//           <button onClick={reload}>{t('common.retryLoading')}</button>
//         </div>
//       );
//
//     default:
//       return notReachable(state);
//   }
// };
