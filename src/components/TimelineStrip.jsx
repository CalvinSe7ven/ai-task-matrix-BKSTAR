import React, { useState, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw, AlertCircle } from 'lucide-react';

export default function TimelineStrip({ tasks, selectedDate, onSelectDate }) {
  // Generate 14 days centered around today (2 days ago to +11 days)
  const [baseDate, setBaseDate] = useState(() => new Date());
  const scrollRef = useRef(null);

  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

  // Generate 14 days array from baseDate - 2 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 2 + i);
    
    // Format YYYY-MM-DD in local time
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const dateNum = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dateNum}`;

    const isToday = dateStr === todayStr;

    // Format day label in Vietnamese (T2, T3, T4, T5, T6, T7, CN)
    const dayOfWeekIndex = d.getDay();
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayName = dayNames[dayOfWeekIndex];

    return {
      date: d,
      dateStr,
      dateNum: d.getDate(),
      monthNum: d.getMonth() + 1,
      dayName,
      isToday
    };
  });

  // Calculate task distribution for each date string
  const taskMapByDate = {};
  let overdueTasksCount = 0;

  const now = new Date();

  tasks.forEach((t) => {
    if (!t.deadline) return;

    // Check overdue
    if (t.status !== 'COMPLETED' && new Date(t.deadline) < now) {
      overdueTasksCount++;
    }

    // Extract YYYY-MM-DD
    const taskDateStr = t.deadline.slice(0, 10);
    if (!taskMapByDate[taskDateStr]) {
      taskMapByDate[taskDateStr] = {
        DO_NOW: 0,
        PLAN: 0,
        DELEGATE: 0,
        BACKLOG: 0,
        total: 0,
        hasOverdue: false
      };
    }

    taskMapByDate[taskDateStr][t.matrix_zone] = (taskMapByDate[taskDateStr][t.matrix_zone] || 0) + 1;
    taskMapByDate[taskDateStr].total += 1;

    if (t.status !== 'COMPLETED' && new Date(t.deadline) < now) {
      taskMapByDate[taskDateStr].hasOverdue = true;
    }
  });

  const shiftDays = (daysOffset) => {
    setBaseDate((prev) => {
      const newD = new Date(prev);
      newD.setDate(newD.getDate() + daysOffset);
      return newD;
    });
  };

  const handleResetToToday = () => {
    setBaseDate(new Date());
    onSelectDate(todayStr);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-6">
      <div className="glass-panel border border-slate-800/90 rounded-2xl p-4 shadow-xl shadow-slate-950/70 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/4 w-96 h-24 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Timeline Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>Tiến Trình Theo Ngày (Timeline Strip)</span>
                {selectedDate && (
                  <span className="normal-case px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md text-[11px] font-semibold border border-indigo-500/30">
                    Đang xem: {selectedDate}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                Chọn một ngày để lọc công việc có deadline trong ngày đó
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Reset All Days Filter */}
            <button
              type="button"
              onClick={() => onSelectDate(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                selectedDate === null
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Tất cả ngày</span>
            </button>

            {/* Jump to Today */}
            <button
              type="button"
              onClick={handleResetToToday}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                selectedDate === todayStr
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-900/80 text-emerald-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              Hôm nay
            </button>

            {/* Prev/Next week buttons */}
            <div className="flex items-center gap-1 ml-1 bg-slate-900/90 border border-slate-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => shiftDays(-7)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="7 ngày trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftDays(7)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="7 ngày sau"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days Horizontal Slider */}
        <div 
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
        >
          {days.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            const taskData = taskMapByDate[item.dateStr];
            const totalTasks = taskData?.total || 0;

            return (
              <button
                key={item.dateStr}
                onClick={() => onSelectDate(isSelected ? null : item.dateStr)}
                className={`flex-1 min-w-[72px] sm:min-w-[80px] p-2.5 rounded-xl border flex flex-col items-center justify-between gap-1.5 transition-all duration-200 shrink-0 relative ${
                  isSelected
                    ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-lg shadow-indigo-600/40 scale-[1.03] z-10'
                    : item.isToday
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-slate-100 ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                {/* Today Badge */}
                {item.isToday && (
                  <span className={`absolute -top-2 px-1.5 py-0.2 text-[9px] font-bold rounded-full border uppercase tracking-wider ${
                    isSelected ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  }`}>
                    Hôm nay
                  </span>
                )}

                {/* Overdue Warning Icon */}
                {taskData?.hasOverdue && !isSelected && (
                  <div className="absolute top-1 right-1 text-rose-400" title="Có task quá hạn">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                )}

                {/* Day Name & Date Number */}
                <div className="text-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isSelected ? 'text-indigo-100' : item.isToday ? 'text-indigo-300' : 'text-slate-500'
                  }`}>
                    {item.dayName}
                  </span>
                  <span className={`text-base font-extrabold block leading-tight ${
                    isSelected ? 'text-white' : item.isToday ? 'text-indigo-200' : 'text-slate-200'
                  }`}>
                    {item.dateNum}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium block">
                    Thg {item.monthNum}
                  </span>
                </div>

                {/* Task Indicators (Colored Dots by Zone) */}
                <div className="min-h-[16px] flex items-center justify-center gap-1 mt-1">
                  {totalTasks > 0 ? (
                    <div className="flex items-center gap-1">
                      {taskData.DO_NOW > 0 && (
                        <span 
                          className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" 
                          title={`${taskData.DO_NOW} task Làm ngay`}
                        />
                      )}
                      {taskData.PLAN > 0 && (
                        <span 
                          className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" 
                          title={`${taskData.PLAN} task Lên kế hoạch`}
                        />
                      )}
                      {taskData.DELEGATE > 0 && (
                        <span 
                          className="w-2 h-2 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" 
                          title={`${taskData.DELEGATE} task Giao việc`}
                        />
                      )}
                      {taskData.BACKLOG > 0 && (
                        <span 
                          className="w-2 h-2 rounded-full bg-slate-400 shadow-sm" 
                          title={`${taskData.BACKLOG} task Lưu trữ`}
                        />
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-mono">-</span>
                  )}
                </div>

                {/* Total Tasks Badge count if > 0 */}
                {totalTasks > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {totalTasks}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
