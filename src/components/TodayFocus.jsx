import React from 'react';
import { Target, CheckCircle2, Circle, Clock, Sparkles, CalendarRange } from 'lucide-react';
import { ZONE_CONFIG } from '../types/task';
import confetti from 'canvas-confetti';

export default function TodayFocus({ tasks, selectedDate, onToggleStatus }) {
  const todayStr = new Date().toLocaleDateString('en-CA');
  const targetDateStr = selectedDate || todayStr;
  const isToday = targetDateStr === todayStr;

  const dateObj = new Date(targetDateStr);
  const formattedDateStr = dateObj.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  // Filter tasks active on targetDateStr (targetDateStr in range [start, end])
  const focusTasks = tasks.filter((t) => {
    let start = t.start_date ? t.start_date.slice(0, 10) : (t.end_date || t.deadline || '').slice(0, 10);
    let end = t.end_date ? t.end_date.slice(0, 10) : (t.start_date || t.deadline || '').slice(0, 10);

    if (!start && !end) return false;
    if (!start) start = end;
    if (!end) end = start;

    if (start > end) {
      const tmp = start;
      start = end;
      end = tmp;
    }

    return targetDateStr >= start && targetDateStr <= end;
  });

  const zonePriority = {
    DO_NOW: 1,
    PLAN: 2,
    DELEGATE: 3,
    BACKLOG: 4
  };

  const sortedTasks = [...focusTasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === 'COMPLETED' ? 1 : -1;
    }
    const priorityDiff = (zonePriority[a.matrix_zone] || 99) - (zonePriority[b.matrix_zone] || 99);
    if (priorityDiff !== 0) return priorityDiff;
    return (a.end_date || a.deadline || '').localeCompare(b.end_date || b.deadline || '');
  });

  const completedCount = sortedTasks.filter((t) => t.status === 'COMPLETED').length;

  const handleToggle = (taskId, isCompleted) => {
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
    onToggleStatus(taskId);
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 sm:p-5 shadow-md h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 border-2 border-rose-300 rounded-xl text-rose-700">
              <Target className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
                {isToday ? '🎯 Tiêu điểm hôm nay' : `🎯 Danh sách ngày ${targetDateStr}`}
              </h3>
              <p className="text-xs font-bold text-gray-700">
                {formattedDateStr} • {sortedTasks.length} công việc ({completedCount} hoàn thành)
              </p>
            </div>
          </div>

          {sortedTasks.length > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-900 border-2 border-blue-300 rounded-full text-xs font-black shrink-0">
              {completedCount}/{sortedTasks.length} Done
            </span>
          )}
        </div>

        {/* Task List */}
        <div className="space-y-2.5 overflow-y-auto max-h-[340px] pr-1">
          {sortedTasks.length === 0 ? (
            <div className="py-10 px-4 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50/50">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-emerald-700" />
              </div>
              <h4 className="text-base font-extrabold text-gray-900">
                {isToday ? 'Không có công việc nào trong hôm nay!' : 'Không có công việc nào scheduled cho ngày này!'}
              </h4>
              <p className="text-xs font-bold text-gray-600 mt-1">
                Thư giãn và nghỉ ngơi thôi! 🎉 Hoặc tạo công việc mới ở thanh trên.
              </p>
            </div>
          ) : (
            sortedTasks.map((t) => {
              const zone = ZONE_CONFIG[t.matrix_zone] || ZONE_CONFIG.DO_NOW;
              const isCompleted = t.status === 'COMPLETED';

              const startStr = t.start_date || t.deadline || '';
              const endStr = t.end_date || t.deadline || '';
              const isMultiDay = startStr && endStr && startStr.slice(0, 10) !== endStr.slice(0, 10);

              let endTimeStr = '';
              if (endStr && endStr.includes('T')) {
                endTimeStr = endStr.split('T')[1].slice(0, 5);
              }

              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-gray-100/90 border-gray-300 opacity-90'
                      : t.matrix_zone === 'DO_NOW'
                      ? 'bg-red-50/60 border-red-300 hover:border-red-500 shadow-xs'
                      : 'bg-white border-gray-300 hover:border-blue-500 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(t.id, isCompleted)}
                      className="text-gray-400 hover:text-blue-600 transition shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600 stroke-[2.2]" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <h5 className={`text-sm sm:text-base font-extrabold truncate ${
                        isCompleted ? 'line-through text-gray-600' : 'text-gray-900'
                      }`}>
                        {t.title}
                      </h5>
                      {t.description && (
                        <p className={`text-xs font-semibold truncate ${
                          isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'
                        }`}>
                          {t.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Zone Badge */}
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black border-2 ${zone.badgeBg}`}>
                      {zone.title.split(' ')[0]}
                    </span>

                    {/* Time / Multi-day badge */}
                    {isMultiDay ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-100 border-2 border-blue-300 px-2 py-0.5 rounded-lg">
                        <CalendarRange className="w-3.5 h-3.5" />
                        Đang chạy
                      </span>
                    ) : endTimeStr ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-800 bg-gray-100 border-2 border-gray-300 px-2 py-0.5 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        {endTimeStr}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-xs font-bold text-gray-600">
        <span>Tự động ưu tiên 🔴 Do Now ở đầu danh sách</span>
        <span>{sortedTasks.length - completedCount} task chưa xong</span>
      </div>
    </div>
  );
}
