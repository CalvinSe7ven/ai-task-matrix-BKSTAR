import React from 'react';
import MiniCalendar from './MiniCalendar';
import TodayFocus from './TodayFocus';

export default function CalendarFocusSection({ tasks, selectedDate, onSelectDate, onToggleStatus }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column (40% / 5 cols): Compact Mini Calendar */}
        <div className="lg:col-span-5 h-full">
          <MiniCalendar
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
          />
        </div>

        {/* Right Column (60% / 7 cols): Today's Focus List */}
        <div className="lg:col-span-7 h-full">
          <TodayFocus
            tasks={tasks}
            selectedDate={selectedDate}
            onToggleStatus={onToggleStatus}
          />
        </div>
      </div>
    </div>
  );
}
