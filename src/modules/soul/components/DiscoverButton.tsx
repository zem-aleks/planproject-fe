import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { createChat } from '@/modules/chat/api/createChat';
import type { ChatContext } from '@/modules/chat/types/entity';
import { Button } from '@/ui/button';

export const DiscoverButton = ({
  projectId,
  contextType,
}: {
  projectId: string;
  contextType: ChatContext['type'];
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      const chat = await createChat(projectId, { type: contextType });
      navigate(`/project/${projectId}/chat/${chat.id}`);
    } catch {
      toast.error('Failed to create chat');
      setLoading(false);
    }
  }, [projectId, contextType, navigate]);

  return (
    <Button variant="default" size="sm" loading={loading} onClick={handleClick}>
      <MessageCircle className="size-3.5" />
      Discover
    </Button>
  );
};
