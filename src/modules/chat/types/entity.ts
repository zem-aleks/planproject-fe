export type ChatContext = {
  type:
    | 'general'
    | 'phase'
    | 'milestone'
    | 'task'
    | 'open_question'
    | 'workstream'
    | 'assumption'
    | 'decision'
    | 'desired_outcome'
    | 'constraint'
    | 'resource'
    | 'target_user'
    | 'project_context';
  entityId?: string;
  label?: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  proposals: ChatProposal[];
  createdAt: string;
};

export type ChatEntity = {
  id: string;
  projectId: string;
  name: string | null;
  context: ChatContext | null;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

export type ChatPreviewEntity = {
  id: string;
  projectId: string;
  name: string | null;
  context: ChatContext | null;
  createdAt: string;
  updatedAt: string;
};

export type ChatProposal = {
  id: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
};

export type UnlockedSection = 'competitors' | 'auditory';
