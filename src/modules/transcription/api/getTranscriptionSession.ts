import { AxiosRequestConfig } from 'axios';

import { api } from '@/modules/api/api.ts';

export type TranscriptionSession = {
  id: string;
  expires_at: number;
  client_secret: {
    value: string;
    expires_at: number;
  };
};

export const getTranscriptionSession = async (
  params: { threshold: number },
  config?: AxiosRequestConfig,
): Promise<TranscriptionSession> => {
  return api.get(`/ai/session?threshold=${params.threshold}`, {
    signal: config?.signal,
  });
};

//
// {
//   id: 'sess_BNmucxZTE4pLm8pEG2MC0',
//     object: 'realtime.transcription_session',
//   expires_at: 0,
//   input_audio_noise_reduction: null,
//   turn_detection: {
//   type: 'server_vad',
//     threshold: 0.5,
//     prefix_padding_ms: 300,
//     silence_duration_ms: 200
// },
//   input_audio_format: 'pcm16',
//     input_audio_transcription: {
//   model: 'gpt-4o-transcribe',
//     language: null,
//     prompt: 'Conversation about food ordering'
// },
//   client_secret: {
//     value: 'ek_6802ba6e99f0819087f7e0cb4d20c7ee',
//       expires_at: 1745016462
//   },
//   include: null
// }
