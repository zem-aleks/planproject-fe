import { ENV } from '@/modules/config';

const API_URL = ENV.VITE_BACKEND_URL;

export const getMessageSrc = (
  message: string,
  voiceId: string,
  optimizationLevel: '0' | '1' | '2' | '3' | '4' = '1',
  speed: number = 1,
  language: string | undefined,
) => {
  // const modelId = 'eleven_monolingual_v1';
  // const modelId = 'eleven_turbo_v2';
  // const modelId = 'eleven_turbo_v2_5';
  const modelId = 'eleven_flash_v2_5';
  return `${API_URL}/tts?modelId=${modelId}&voiceId=${voiceId}&text=${encodeURIComponent(
    message,
  )}&optimizationLevel=${optimizationLevel}&speed=${speed}&language=${language || ''}`;
};
