'use client';

import { Gift, Calendar, ChevronRight } from 'lucide-react';

interface Occasion {
  id: string;
  recipientName: string;
  recipientAvatar: string;
  occasionType: string;
  date: string;
  daysUntil: number;
  isScheduled: boolean;
}

interface UpcomingOccasionsProps {
  onScheduleGift: (occasion: Occasion) => void;
}

export function UpcomingOccasions({ onScheduleGift }: UpcomingOccasionsProps) {
  // Mock data
  const occasions: Occasion[] = [
    {
      id: '1',
      recipientName: 'Clarice Birdseye',
      recipientAvatar: '👩',
      occasionType: 'Birthday',
      date: 'Jan 22',
      daysUntil: 0,
      isScheduled: false,
    },
    {
      id: '2',
      recipientName: 'Duke of Vlad Moon',
      recipientAvatar: '🧛',
      occasionType: 'Birthday',
      date: 'Feb 3',
      daysUntil: 12,
      isScheduled: true,
    },
    {
      id: '3',
      recipientName: 'Mommy & Aunt Kay too',
      recipientAvatar: '👵',
      occasionType: 'Birthday',
      date: 'Feb 15',
      daysUntil: 24,
      isScheduled: false,
    },
    {
      id: '4',
      recipientName: "Maeve Wentworth's Gift",
      recipientAvatar: '🎁',
      occasionType: 'Anniversary',
      date: 'Feb 28',
      daysUntil: 37,
      isScheduled: false,
    },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-fg">Upcoming Events</h2>
        <button className="text-sm text-accent hover:text-yellow-400 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {occasions.map((occasion) => (
          <button
            key={occasion.id}
            onClick={() => onScheduleGift(occasion)}
            className={`
              w-full p-4 rounded-lg flex items-center gap-4 transition-all duration-200
              ${occasion.daysUntil === 0 
                ? 'occasion-card-today' 
                : 'occasion-card'
              }
            `}
          >
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-2xl">
              {occasion.recipientAvatar}
            </div>

            <div className="flex-1 text-left">
              <h3 className="font-semibold text-fg">{occasion.recipientName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-muted" />
                <span className="text-sm text-muted">{occasion.occasionType}</span>
                <span className="text-sm text-muted">•</span>
                <span className="text-sm text-muted">{occasion.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {occasion.isScheduled ? (
                <div className="flex items-center gap-2 px-3 py-1 bg-success bg-opacity-20 rounded-full">
                  <Gift className="w-4 h-4 text-success" />
                  <span className="text-xs font-medium text-success">Scheduled</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 bg-warning bg-opacity-20 rounded-full">
                  <span className="text-xs font-medium text-warning">
                    {occasion.daysUntil === 0 ? 'Today!' : `${occasion.daysUntil}d`}
                  </span>
                </div>
              )}
              <ChevronRight className="w-5 h-5 text-muted" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
