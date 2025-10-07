'use client';

import { type Occasion, type Recipient } from '@/lib/types';
import { getDaysUntil, formatDaysUntil } from '@/lib/utils';
import { Calendar, Gift, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OccasionCardProps {
  occasion: Occasion;
  recipient: Recipient;
  onClick?: () => void;
}

export function OccasionCard({ occasion, recipient, onClick }: OccasionCardProps) {
  const daysUntil = getDaysUntil(new Date(occasion.date));
  const isToday = daysUntil === 0;
  const isPast = daysUntil < 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'occasion-card fade-in',
        isToday && 'occasion-card-today'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-bg font-bold text-lg">
            {recipient.name.charAt(0)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg text-fg">{recipient.name}</h3>
              <p className="text-sm text-muted">{occasion.name}</p>
            </div>
            <ChevronRight className="text-muted flex-shrink-0" size={20} />
          </div>

          {/* Date Info */}
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={16} className="text-accent" />
              <span className="text-muted">{occasion.date}</span>
            </div>
            {!isPast && (
              <div className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                isToday ? 'bg-accent text-bg' : 'bg-surface text-accent'
              )}>
                {formatDaysUntil(daysUntil)}
              </div>
            )}
          </div>

          {/* Gift Status */}
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Gift size={16} className="text-success" />
            <span className="text-success">Gift Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
