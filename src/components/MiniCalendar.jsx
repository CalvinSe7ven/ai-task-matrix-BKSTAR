import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export default function MiniCalendar({ tasks, selectedDate, onSelectDate }) {
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-CA');

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    onSelectDate(todayStr);
  };

  // Build 7-column grid (Mon..Sun)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6;

  const totalDaysInMonth = lastDayOfMonth.getDate();
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
  const calendarCells = [];

  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
    const monthStr = String(prevM + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    calendarCells.push({
      dayNum: d,
      dateStr: `${prevY}-${monthStr}-${dayStr}`,
      isCurrentMonth: false
    });
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    calendarCells.push({
      dayNum: d,
      dateStr: `${currentYear}-${monthStr}-${dayStr}`,
      isCurrentMonth: true
    });
  }

  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
    const monthStr = String(nextM + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    calendarCells.push({
      dayNum: d,
      dateStr: `${nextY}-${monthStr}-${dayStr}`,
      isCurrentMonth: false
    });
  }

  // Multi-day task distribution map
  const now = new Date();

  // For each calendar cell dateStr, calculate tasks spanning over dateStr
  const getTaskDataForDate = (dateStr) => {
    const data = {
      DO_NOW: 0,
      PLAN: 0,
      DELEGATE: 0,
      BACKLOG: 0,
      total: 0,
      hasOverdue: false
    };

    tasks.forEach((t) => {
      let start = t.start_date ? t.start_date.slice(0, 10) : (t.end_date || t.deadline || '').slice(0, 10);
      let end = t.end_date ? t.end_date.slice(0, 10) : (t.start_date || t.deadline || '').slice(0, 10);

      if (!start && !end) return;
      if (!start) start = end;
      if (!end) end = start;

      // Ensure start <= end
      if (start > end) {
        const tmp = start;
        start = end;
        end = tmp;
      }

      // Check if dateStr falls in range [start, end]
      if (dateStr >= start && dateStr <= end) {
        data[t.matrix_zone] = (data[t.matrix_zone] || 0) + 1;
        data.total += 1;

        // Check if task is overdue
        const endObj = new Date(t.end_date || t.deadline || `${end}T23:59`);
        if (t.status !== 'COMPLETED' && endObj < now) {
          data.hasOverdue = true;
        }
      }
    });

    return data;
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const weekHeaderNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 shadow-md h-full flex flex-col justify-between">
      <div>
        {/* Header: Title + Navigation */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b-2 border-gray-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 bg-blue-100 border-2 border-blue-300 rounded-xl text-blue-800 shrink-0">
              <CalendarIcon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-gray-900 truncate">
                {monthNames[currentMonth]} {currentYear}
              </h3>
              <p className="text-[11px] font-bold text-gray-600 truncate">
                Hỗ trợ task chạy nhiều ngày
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Reset / All */}
            <button
              type="button"
              onClick={() => onSelectDate(null)}
              className={`p-1.5 rounded-lg text-xs font-black border-2 transition ${
                selectedDate === null
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
              }`}
              title="Xem tất cả ngày"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Jump Today */}
            <button
              type="button"
              onClick={handleJumpToToday}
              className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 transition ${
                selectedDate === todayStr
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
              }`}
            >
              Hôm nay
            </button>

            {/* Navigation */}
            <div className="flex items-center border-2 border-gray-300 rounded-lg p-0.5 bg-gray-100">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded text-gray-800 hover:bg-white hover:text-black transition"
                title="Tháng trước"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded text-gray-800 hover:bg-white hover:text-black transition"
                title="Tháng sau"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact 7-Column Mini Grid */}
        <div className="w-full">
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {weekHeaderNames.map((name) => (
              <div key={name} className="text-[11px] font-black text-gray-800 uppercase tracking-wider">
                {name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell) => {
              const isToday = cell.dateStr === todayStr;
              const isSelected = selectedDate === cell.dateStr;
              const taskData = getTaskDataForDate(cell.dateStr);
              const totalTasks = taskData.total || 0;

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => onSelectDate(isSelected ? null : cell.dateStr)}
                  className={`min-h-[34px] sm:min-h-[36px] py-0.5 px-0.5 rounded-lg border-2 flex flex-col items-center justify-between transition-all duration-150 relative ${
                    isSelected
                      ? 'bg-blue-100 border-blue-600 text-blue-950 shadow-xs ring-2 ring-blue-500/30'
                      : isToday
                      ? 'bg-blue-50 border-blue-400 text-gray-900 font-extrabold'
                      : cell.isCurrentMonth
                      ? 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50/60 text-gray-900'
                      : 'bg-gray-100/70 border-gray-200 text-gray-400 hover:bg-gray-200/80'
                  }`}
                >
                  {/* Overdue Dot */}
                  {taskData.hasOverdue && !isSelected && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-600 shadow-xs" title="Có task quá hạn" />
                  )}

                  {/* Date Number Pill */}
                  <span
                    className={`w-6 h-6 flex items-center justify-center text-xs font-extrabold transition-all ${
                      isToday
                        ? 'bg-blue-600 text-white rounded-full font-black shadow-xs'
                        : isSelected
                        ? 'text-blue-900 font-black'
                        : cell.isCurrentMonth
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {/* Color dots for task zones */}
                  <div className="flex items-center justify-center gap-0.5 min-h-[6px]">
                    {totalTasks > 0 ? (
                      <div className="flex items-center gap-0.5">
                        {taskData.DO_NOW > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" title={`${taskData.DO_NOW} DO NOW`} />
                        )}
                        {taskData.PLAN > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title={`${taskData.PLAN} PLAN`} />
                        )}
                        {taskData.DELEGATE > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" title={`${taskData.DELEGATE} DELEGATE`} />
                        )}
                        {taskData.BACKLOG > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" title={`${taskData.BACKLOG} BACKLOG`} />
                        )}
                      </div>
                    ) : (
                      <span className="text-[6px] text-transparent">-</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
