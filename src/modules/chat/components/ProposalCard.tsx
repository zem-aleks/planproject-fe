import { useState } from 'react';

import { Check, Lightbulb, X } from 'lucide-react';
import { toast } from 'sonner';

import { approveProposal } from '@/modules/chat/api/approveProposal';
import { rejectProposal } from '@/modules/chat/api/rejectProposal';
import type { ChatProposal } from '@/modules/chat/types/entity';
import type { ProjectEntity } from '@/modules/projects/types/entity';
import { Button } from '@/ui/button';
import { MarkdownFormat } from '@/ui/custom/MarkdownFormat';
import { cn } from '@/ui/lib/utils';

export const ProposalCard = ({
  proposal,
  projectId,
  chatId,
  onStatusChange,
}: {
  proposal: ChatProposal;
  projectId: string;
  chatId: string;
  onStatusChange: (
    proposalId: string,
    status: 'approved' | 'rejected',
    project?: ProjectEntity,
  ) => void;
}) => {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const handleApprove = async () => {
    setLoading('approve');
    try {
      const project = await approveProposal({
        projectId,
        chatId,
        proposalId: proposal.id,
      });
      onStatusChange(proposal.id, 'approved', project);
    } catch {
      toast.error('Failed to approve proposal');
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async () => {
    setLoading('reject');
    try {
      await rejectProposal({
        projectId,
        chatId,
        proposalId: proposal.id,
      });
      onStatusChange(proposal.id, 'rejected');
    } catch {
      toast.error('Failed to reject proposal');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className={cn(
        'my-1 flex flex-col gap-3 rounded-lg border p-4',
        proposal.status === 'approved' && 'border-green-200 bg-green-50',
        proposal.status === 'rejected' && 'border-red-200 bg-red-50',
        proposal.status === 'pending' && 'border-primary/20 bg-primary/5',
      )}
    >
      <div className="flex min-w-0 items-start gap-2">
        <Lightbulb className="text-primary mt-0.5 size-4 shrink-0" />
        <div className="prose-sm min-w-0 overflow-hidden text-sm font-medium break-words">
          <MarkdownFormat>{proposal.description}</MarkdownFormat>
        </div>
      </div>

      {proposal.status === 'pending' ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            loading={loading === 'approve'}
            disabled={loading !== null}
          >
            <Check className="size-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReject}
            loading={loading === 'reject'}
            disabled={loading !== null}
          >
            <X className="size-4" />
            Reject
          </Button>
        </div>
      ) : (
        <p
          className={cn(
            'text-xs font-medium',
            proposal.status === 'approved' && 'text-green-600',
            proposal.status === 'rejected' && 'text-red-600',
          )}
        >
          {proposal.status === 'approved' ? 'Approved' : 'Rejected'}
        </p>
      )}
    </div>
  );
};
