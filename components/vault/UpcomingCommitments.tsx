'use client';

import { type ScheduledGift, type Occasion, type Recipient } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Calendar, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface UpcomingCommitmentsProps {
  gifts: ScheduledGift[];
  occasions: Occasion[];
  recipients: Recipient[];
}

export function UpcomingCommitments({ gifts, occasions, recipients }: UpcomingCommitmentsProps) {
  const totalCommitted = gifts.reduce((sum, gift) => sum + gift.budget, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-fg">Upcoming Commitments</h3>
        <div className="px-3 py-1 bg-accent bg-opacity-10 rounded-full">
          <span className="text-accent font-semibold">{formatCurrency(totalCommitted)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {gifts.slice(0, 3).map((gift) => {
          const occasion = occasions.find(o => o.id === gift.occasionId);
          const recipient = recipients.find(r => r.id === occasion?.recipientId);
          
          if (!occasion || !recipient) return null;

          return (
            <div key={gift.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-bg font-bold">
                  {recipient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-fg">{recipient.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <Calendar size={12} />
                    <span>{formatDate(gift.executionDate)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-accent font-semibold">
                <DollarSign size={16} />
                <span>{gift.budget}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
