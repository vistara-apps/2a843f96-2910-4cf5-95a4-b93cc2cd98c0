'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OccasionCalendarProps {
  onDateSelect: (date: Date) => void;
}

export function OccasionCalendar({ onDateSelect }: OccasionCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    onDateSelect(date);
  };

  // Mock occasions for demo
  const occasions = [9, 15, 22];
  const today = new Date().getDate();
  const isCurrentMonth = 
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  return (
    <section aria-labelledby="calendar-heading">
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 id="calendar-heading" className="text-lg sm:text-xl font-bold text-fg">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 bg-surface rounded-lg hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-fg" aria-hidden="true" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 bg-surface rounded-lg hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-fg" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2" role="grid" aria-label="Calendar">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted py-2" role="columnheader">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} role="gridcell" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isToday = isCurrentMonth && day === today;
            const hasOccasion = occasions.includes(day);
            const isSelected = selectedDate?.getDate() === day;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                  transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg
                  ${isToday ? 'bg-accent text-slate-900 font-bold' : ''}
                  ${hasOccasion && !isToday ? 'bg-surface border-accent border-2' : ''}
                  ${isSelected && !isToday ? 'bg-slate-700' : ''}
                  ${!isToday && !hasOccasion && !isSelected ? 'hover:bg-surface' : ''}
                `}
                role="gridcell"
                aria-label={`${day} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}${hasOccasion ? ', has occasion' : ''}${isToday ? ', today' : ''}`}
                aria-pressed={isSelected}
              >
                {day}
                {hasOccasion && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
