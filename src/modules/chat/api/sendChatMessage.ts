import { ENV } from '@/modules/config';

type SSECallbacks = {
  onChunk: (content: string) => void;
  onConfirm: (proposal: { id: string; description: string }) => void;
  onDone: (messageId: string, chatName?: string) => void;
  onError: (messageId: string | null) => void;
};

export const sendChatMessage = async (
  projectId: string,
  chatId: string,
  message: string,
  token: string,
  callbacks: SSECallbacks,
  signal?: AbortSignal,
) => {
  const res = await fetch(
    `${ENV.VITE_BACKEND_URL}/projects/${projectId}/chats/${chatId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
      signal,
    },
  );

  if (!res.ok) {
    callbacks.onError(null);
    return;
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const processLine = (line: string) => {
    if (!line.startsWith('data: ')) return false;

    try {
      const data = JSON.parse(line.slice(6));

      switch (data.type) {
        case 'chunk':
          callbacks.onChunk(data.content);
          return false;
        case 'confirm':
          callbacks.onConfirm({
            id: data.proposalId,
            description: data.description,
          });
          return false;
        case 'done':
          callbacks.onDone(data.messageId, data.chatName);
          return true;
        case 'error':
          callbacks.onError(data.messageId ?? null);
          return true;
      }
    } catch {
      // skip malformed lines
    }
    return false;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (processLine(line)) return;
    }
  }

  // Flush remaining buffer — handles cases where the last SSE event
  // has no trailing newline
  if (buffer.trim()) {
    processLine(buffer.trim());
  }
};
