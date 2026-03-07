import { useState } from 'react';

import { Send, Square } from 'lucide-react';

import { Button } from '@/ui/button';
import { Textarea } from '@/ui/textarea';

export const ChatInput = ({
  onSend,
  isStreaming,
  onStop,
}: {
  onSend: (message: string) => void;
  isStreaming: boolean;
  onStop: () => void;
}) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t px-6 py-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="max-h-32 min-h-10 resize-none"
          rows={1}
        />
        {isStreaming ? (
          <Button
            size="icon"
            variant="destructive"
            onClick={onStop}
            className="shrink-0 self-end"
          >
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 self-end"
          >
            <Send className="size-4" />
          </Button>
        )}
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};
