'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { OccasionCard } from '@/components/occasions/OccasionCard';
import { Button } from '@/components/ui/Button';
import { mockRecipients, mockOccasions } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [occasions] = useState(mockOccasions);
  const [recipients] = useState(mockRecipients);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const hasOccasion = (day: number) => {
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${month}-${dayStr}`;
    return occasions.some(o => o.date === dateStr);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-surface border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-fg">Calendar</h1>
              <p className="text-sm text-muted">View all occasions</p>
            </div>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus size={20} />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="text-fg" size={24} />
          </button>
          <h2 className="text-xl font-bold text-fg">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="text-fg" size={24} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="glass-card p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const hasEvent = hasOccasion(day);
              const isToday = 
                day === new Date().getDate() &&
                currentMonth.getMonth() === new Date().getMonth() &&
                currentMonth.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isToday
                      ? 'bg-accent text-bg'
                      : hasEvent
                      ? 'bg-accent bg-opacity-10 text-accent hover:bg-opacity-20'
                      : 'text-fg hover:bg-surface'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Occasions This Month */}
        <div>
          <h3 className="text-lg font-semibold text-fg mb-4">
            Occasions in {monthNames[currentMonth.getMonth()]}
          </h3>
          <div className="space-y-3">
            {occasions
              .filter(o => {
                const [month] = o.date.split('-').map(Number);
                return month === currentMonth.getMonth() + 1;
              })
              .map((occasion) => {
                const recipient = recipients.find(r => r.id === occasion.recipientId);
                if (!recipient) return null;

                return (
                  <OccasionCard
                    key={occasion.id}
                    occasion={occasion}
                    recipient={recipient}
                  />
                );
              })}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
